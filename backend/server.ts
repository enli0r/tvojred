import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type { VerifiedRegistrationResponse, VerifiedAuthenticationResponse } from "@simplewebauthn/server";

import express from 'express';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import session from "express-session";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { db } from './db.js';
import { generateAvailableSlots } from './src/services/availabilityService.js';

//dodato za verifyAuthenticationResponse
function fromBase64url(b64url: string) {
    const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64url.length + 3) % 4);
    return new Uint8Array(Buffer.from(b64, "base64"));
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());


const allowedOrigins = [
    'http://localhost:5173',
    'http://192.168.1.65:5173',
    'http://localhost:3000',
    'http://192.168.1.65:3000',
    'http://tvojred.rs',
    'http://www.tvojred.rs',
    'https://tvojred.rs',
    'https://www.tvojred.rs',
];

function normalizeBool(value: number | boolean) {
    return value === true || value === 1;
}

function getDayOfWeek(date: string) {
    return new Date(date).getDay();
}


async function getTenantWorkingHoursForDate(tenantId: number, date: string) {
    // 1. prvo proveri override
    const [overrideRows]: any = await db.query(
        `
        SELECT *
        FROM tenant_working_overrides
        WHERE tenant_id = ?
          AND ? BETWEEN start_date AND end_date
        ORDER BY start_date DESC, id DESC
        LIMIT 1
        `,
        [tenantId, date]
    );

    if (overrideRows.length > 0) {
        const override = overrideRows[0];

        if (normalizeBool(override.is_closed)) {
            return {
                source: 'override',
                is_working: false,
                start_time: null,
                end_time: null,
            };
        }

        return {
            source: 'override',
            is_working: true,
            start_time: override.start_time,
            end_time: override.end_time,
        };
    }

    // 2. fallback na default weekly working hours
    const dayOfWeek = getDayOfWeek(date);

    const [defaultRows]: any = await db.query(
        `
        SELECT *
        FROM tenant_working_hours
        WHERE tenant_id = ?
          AND day_of_week = ?
        LIMIT 1
        `,
        [tenantId, dayOfWeek]
    );

    if (defaultRows.length === 0) {
        return {
            source: 'default',
            is_working: false,
            start_time: null,
            end_time: null,
        };
    }

    const defaultRow = defaultRows[0];

    if (!normalizeBool(defaultRow.is_working)) {
        return {
            source: 'default',
            is_working: false,
            start_time: null,
            end_time: null,
        };
    }

    return {
        source: 'default',
        is_working: true,
        start_time: defaultRow.start_time,
        end_time: defaultRow.end_time,
    };
}

async function getBarberWorkingHoursForDate(barberId: number, date: string) {
    // 1. prvo proveri override
    const [overrideRows]: any = await db.query(
        `
        SELECT *
        FROM barber_working_overrides
        WHERE barber_id = ?
          AND ? BETWEEN start_date AND end_date
        ORDER BY start_date DESC, id DESC
        LIMIT 1
        `,
        [barberId, date]
    );

    if (overrideRows.length > 0) {
        const override = overrideRows[0];

        if (normalizeBool(override.is_closed)) {
            return {
                source: 'override',
                is_working: false,
                start_time: null,
                end_time: null,
            };
        }

        return {
            source: 'override',
            is_working: true,
            start_time: override.start_time,
            end_time: override.end_time,
        };
    }

    // 2. fallback na default weekly working hours
    const dayOfWeek = getDayOfWeek(date);

    const [defaultRows]: any = await db.query(
        `
        SELECT *
        FROM barber_working_hours
        WHERE barber_id = ?
          AND day_of_week = ?
        LIMIT 1
        `,
        [barberId, dayOfWeek]
    );

    if (defaultRows.length === 0) {
        return {
            source: 'default',
            is_working: false,
            start_time: null,
            end_time: null,
        };
    }

    const defaultRow = defaultRows[0];

    if (!normalizeBool(defaultRow.is_working)) {
        return {
            source: 'default',
            is_working: false,
            start_time: null,
            end_time: null,
        };
    }

    return {
        source: 'default',
        is_working: true,
        start_time: defaultRow.start_time,
        end_time: defaultRow.end_time,
    };
}

function timeToMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60)
        .toString()
        .padStart(2, '0');

    const minutes = (totalMinutes % 60)
        .toString()
        .padStart(2, '0');

    return `${hours}:${minutes}:00`;
}

async function getFinalBarberWorkingHoursForDate(
    tenantId: number,
    barberId: number,
    date: string
) {
    const tenantHours = await getTenantWorkingHoursForDate(tenantId, date);
    const barberHours = await getBarberWorkingHoursForDate(barberId, date);

    if (!tenantHours.is_working || !barberHours.is_working) {
        return {
            is_working: false,
            start_time: null,
            end_time: null,
            tenant_source: tenantHours.source,
            barber_source: barberHours.source,
            reason: 'Tenant ili barber ne radi',
        };
    }

    const tenantStart = timeToMinutes(tenantHours.start_time);
    const tenantEnd = timeToMinutes(tenantHours.end_time);

    const barberStart = timeToMinutes(barberHours.start_time);
    const barberEnd = timeToMinutes(barberHours.end_time);

    const finalStart = Math.max(tenantStart, barberStart);
    const finalEnd = Math.min(tenantEnd, barberEnd);

    if (finalStart >= finalEnd) {
        return {
            is_working: false,
            start_time: null,
            end_time: null,
            tenant_source: tenantHours.source,
            barber_source: barberHours.source,
            reason: 'Nema preseka izmedju tenant i barber radnog vremena',
        };
    }

    return {
        is_working: true,
        start_time: minutesToTime(finalStart),
        end_time: minutesToTime(finalEnd),
        tenant_source: tenantHours.source,
        barber_source: barberHours.source,
        reason: null,
    };
}

app.use(cors({
    origin: (origin, cb) => {
        // allow non-browser tools (curl/postman)
        if (!origin) return cb(null, true);

        if (allowedOrigins.includes(origin)) return cb(null, true);

        return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
}));

app.use(session({
    name: "tvojred.sid",
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,

    // produžava cookie na svaki aktivan request
    rolling: true,

    cookie: {
        httpOnly: true,
        sameSite: "lax",

        // lokalno false, u produkciji sa HTTPS true
        secure: false,

        // 7 dana login
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));
type TenantStaffRole = 'owner' | 'admin' | 'barber';

function requireTenantStaff(allowedRoles: TenantStaffRole[]): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.session as any).userId as number | undefined;
            const tenantSlug = String(req.params.tenantSlug || '');

            if (!userId) {
                return res.status(401).json({
                    message: 'Moraš biti ulogovan',
                    code: 'NOT_AUTHENTICATED'
                });
            }

            if (!tenantSlug) {
                return res.status(400).json({
                    message: 'Nedostaje tenant slug',
                    code: 'MISSING_TENANT_SLUG'
                });
            }

            const [rows]: any = await db.query(
                `
                SELECT 
                    ts.id AS staff_id,
                    ts.role,
                    ts.is_active,

                    u.id AS user_id,
                    u.name AS user_name,
                    u.phone AS user_phone,

                    t.id AS tenant_id,
                    t.name AS tenant_name,
                    t.slug AS tenant_slug
                FROM tenant_staff ts
                INNER JOIN users u ON u.id = ts.user_id
                INNER JOIN tenants t ON t.id = ts.tenant_id
                WHERE ts.user_id = ?
                  AND t.slug = ?
                  AND ts.is_active = TRUE
                LIMIT 1
                `,
                [userId, tenantSlug]
            );

            if (rows.length === 0) {
                return res.status(403).json({
                    message: 'Nemaš dozvolu za upravljanje ovim lokalom',
                    code: 'ADMIN_ACCESS_DENIED'
                });
            }

            const staff = rows[0];

            if (!allowedRoles.includes(staff.role)) {
                return res.status(403).json({
                    message: 'Nemaš dovoljna ovlašćenja za ovu akciju',
                    code: 'INSUFFICIENT_ROLE'
                });
            }

            (req as any).tenantStaff = {
                staffId: staff.staff_id,
                role: staff.role,

                user: {
                    id: staff.user_id,
                    name: staff.user_name,
                    phone: staff.user_phone
                },

                tenant: {
                    id: staff.tenant_id,
                    name: staff.tenant_name,
                    slug: staff.tenant_slug
                }
            };

            next();
        } catch (err) {
            console.error('REQUIRE TENANT STAFF ERROR:', err);

            return res.status(500).json({
                message: 'Greška pri proveri admin pristupa',
                code: 'TENANT_STAFF_CHECK_FAILED'
            });
        }
    };
}

function requireTenantRole(allowedRoles: TenantStaffRole[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const staff = (req as any).tenantStaff;

        if (!staff) {
            return res.status(401).json({
                message: 'Admin pristup nije proveren',
                code: 'TENANT_STAFF_NOT_LOADED'
            });
        }

        if (!allowedRoles.includes(staff.role)) {
            return res.status(403).json({
                message: 'Nemaš dovoljna ovlašćenja za ovu akciju',
                code: 'INSUFFICIENT_ROLE'
            });
        }

        next();
    };
}



app.get('/', (req: Request, res: Response) => {
    res.json({ message: "Server radi!" });
});


app.get('/tenants/by-slug/:slug', async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug;

        const [rows]: any = await db.query(
            `
            SELECT id, name, slug
            FROM tenants
            WHERE slug = ?
            LIMIT 1
            `,
            [slug]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tenant nije pronađen' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška baze' });
    }
});


app.get('/barbers', async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM barbers');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.get('/services', async (req: Request, res: Response) => {
    try {
        const barberId = Number(req.query.barber_id);

        if (!barberId) {
            return res.status(400).json({ message: "Missing barber_id" });
        }

        const [rows] = await db.query(
            `
        SELECT
            bs.id,
            bs.barber_id,
            bs.service_id,
            bs.price,
            bs.duration,
            bs.is_active,
            s.name,
            s.description
        FROM barber_services bs
        INNER JOIN services s ON s.id = bs.service_id
        WHERE bs.barber_id = ?
          AND bs.is_active = true
        ORDER BY s.name ASC
        `,
            [barberId]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greska baze" });
    }
});

app.get("/appointments", async (req: Request, res: Response) => {
    try {
        const barberId = Number(req.query.barber_id);
        const date = String(req.query.date || "");

        if (!barberId || !date) {
            return res.status(400).json({ message: "Missing barber_id or date" });
        }

        // opseg: [date 00:00:00, nextDate 00:00:00)
        const startOfDay = `${date} 00:00:00`;

        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        const yyyy = next.getFullYear();
        const mm = String(next.getMonth() + 1).padStart(2, "0");
        const dd = String(next.getDate()).padStart(2, "0");
        const nextDay = `${yyyy}-${mm}-${dd} 00:00:00`;

        const [rows] = await db.query(
            `
      SELECT *
      FROM appointments
      WHERE barber_id = ?
        AND start_time >= ?
        AND start_time < ?
      ORDER BY start_time
      `,
            [barberId, startOfDay, nextDay]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greska baze" });
    }
});

app.post('/appointments', async (req: Request, res: Response) => {
    const conn = await db.getConnection();

    try {
        const {
            tenant_id,
            barber_id,
            start_time,
            end_time
        } = req.body;

        const userId = (req.session as any).userId as number | undefined;

        if (!userId) {
            return res.status(401).json({
                message: 'Moraš biti ulogovan da bi zakazao termin',
                code: 'NOT_AUTHENTICATED'
            });
        }

        if (!tenant_id || !barber_id || !start_time || !end_time) {
            return res.status(400).json({
                message: 'Nedostaju podaci za termin',
                code: 'MISSING_APPOINTMENT_DATA'
            });
        }

        await conn.beginTransaction();

        const [userRows]: any = await conn.query(
            `
            SELECT id, name, phone, phone_normalized
            FROM users
            WHERE id = ?
            LIMIT 1
            FOR UPDATE
            `,
            [userId]
        );

        if (userRows.length === 0) {
            await conn.rollback();

            return res.status(401).json({
                message: 'Korisnik nije pronađen',
                code: 'USER_NOT_FOUND'
            });
        }

        const user = userRows[0];

        const phoneNormalized =
            user.phone_normalized || normalizeSerbianPhone(user.phone);

        if (!user.phone_normalized) {
            await conn.query(
                `
                UPDATE users
                SET phone_normalized = ?
                WHERE id = ?
                `,
                [phoneNormalized, user.id]
            );
        }

        const [customerRows]: any = await conn.query(
            `
            SELECT id
            FROM customers
            WHERE tenant_id = ?
              AND user_id = ?
            LIMIT 1
            FOR UPDATE
            `,
            [tenant_id, user.id]
        );

        let customerId: number;

        if (customerRows.length > 0) {
            customerId = customerRows[0].id;

            await conn.query(
                `
                UPDATE customers
                SET name = ?,
                    phone = ?,
                    phone_normalized = ?
                WHERE id = ?
                `,
                [user.name, user.phone, phoneNormalized, customerId]
            );
        } else {
            const [customerByPhoneRows]: any = await conn.query(
                `
                SELECT id
                FROM customers
                WHERE tenant_id = ?
                  AND phone_normalized = ?
                LIMIT 1
                FOR UPDATE
                `,
                [tenant_id, phoneNormalized]
            );

            if (customerByPhoneRows.length > 0) {
                customerId = customerByPhoneRows[0].id;

                await conn.query(
                    `
                    UPDATE customers
                    SET user_id = ?,
                        name = ?,
                        phone = ?,
                        phone_normalized = ?
                    WHERE id = ?
                    `,
                    [user.id, user.name, user.phone, phoneNormalized, customerId]
                );
            } else {
                const [customerResult]: any = await conn.query(
                    `
                    INSERT INTO customers (
                        tenant_id,
                        user_id,
                        name,
                        phone,
                        phone_normalized
                    )
                    VALUES (?, ?, ?, ?, ?)
                    `,
                    [tenant_id, user.id, user.name, user.phone, phoneNormalized]
                );

                customerId = customerResult.insertId;
            }
        }

        const appointmentDate = String(start_time).slice(0, 10);

        const [dailyUserRows]: any = await conn.query(
            `
            SELECT a.id
            FROM appointments a
            INNER JOIN customers c ON c.id = a.customer_id
            WHERE a.tenant_id = ?
              AND c.user_id = ?
              AND DATE(a.start_time) = ?
              AND a.status IN ('pending', 'confirmed')
            LIMIT 1
            FOR UPDATE
            `,
            [tenant_id, user.id, appointmentDate]
        );

        if (dailyUserRows.length > 0) {
            await conn.rollback();

            return res.status(409).json({
                message: 'Već imaš jedan zakazan termin za ovaj dan',
                code: 'USER_DAILY_LIMIT_REACHED'
            });
        }

        const [dailyPhoneRows]: any = await conn.query(
            `
            SELECT a.id
            FROM appointments a
            INNER JOIN customers c ON c.id = a.customer_id
            WHERE a.tenant_id = ?
              AND c.phone_normalized = ?
              AND DATE(a.start_time) = ?
              AND a.status IN ('pending', 'confirmed')
            LIMIT 1
            FOR UPDATE
            `,
            [tenant_id, phoneNormalized, appointmentDate]
        );

        if (dailyPhoneRows.length > 0) {
            await conn.rollback();

            return res.status(409).json({
                message: 'Sa ovim brojem telefona već postoji termin za ovaj dan',
                code: 'PHONE_DAILY_LIMIT_REACHED'
            });
        }

        const [existing]: any = await conn.query(
            `
            SELECT id
            FROM appointments
            WHERE tenant_id = ?
              AND barber_id = ?
              AND status IN ('pending', 'confirmed')
              AND start_time < ?
              AND end_time > ?
            LIMIT 1
            FOR UPDATE
            `,
            [tenant_id, barber_id, end_time, start_time]
        );

        if (existing.length > 0) {
            await conn.rollback();

            return res.status(409).json({
                message: 'Termin je već zauzet',
                code: 'APPOINTMENT_SLOT_TAKEN'
            });
        }

        const [result]: any = await conn.query(
            `
            INSERT INTO appointments (
                tenant_id,
                customer_id,
                barber_id,
                start_time,
                end_time,
                status
            )
            VALUES (?, ?, ?, ?, ?, 'confirmed')
            `,
            [tenant_id, customerId, barber_id, start_time, end_time]
        );

        await conn.commit();

        res.json({
            message: 'Termin uspešno zakazan',
            appointment_id: result.insertId
        });
    } catch (err: any) {
        await conn.rollback();

        if (err?.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Termin je već zauzet',
                code: 'DUPLICATE_APPOINTMENT'
            });
        }

        console.error('CREATE APPOINTMENT ERROR:', err);

        res.status(500).json({
            message: 'Greška pri zakazivanju termina',
            code: 'APPOINTMENT_CREATE_FAILED'
        });
    } finally {
        conn.release();
    }
});

app.get('/tenants/:tenantId/barbers/:barberId/available-slots', async (req: Request, res: Response) => {
    try {
        const tenantId = Number(req.params.tenantId);
        const barberId = Number(req.params.barberId);
        const date = String(req.query.date || '');

        if (!tenantId || !barberId || !date) {
            return res.status(400).json({
                message: 'tenantId, barberId i date su obavezni'
            });
        }

        const slots = await generateAvailableSlots(db, tenantId, barberId, date);

        res.json(slots);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri generisanju termina' });
    }
});

app.post("/auth/register/options", async (req: Request, res: Response) => {
    try {
        const { name, phone } = req.body as { name: string; phone: string };

        if (!name || !phone) {
            return res.status(400).json({ message: "Missing name/phone" });
        }

        const phoneNormalized = normalizeSerbianPhone(phone);

        // 1) nađi ili kreiraj user po normalizovanom telefonu
        const [urows] = await db.query(
            "SELECT id FROM users WHERE phone_normalized = ?",
            [phoneNormalized]
        );

        let userId = (urows as any[])[0]?.id as number | undefined;

        if (!userId) {
            const [ins] = await db.query(
                `
                INSERT INTO users (
                    name,
                    phone,
                    phone_normalized,
                    role
                )
                VALUES (?, ?, ?, 'customer')
                `,
                [name, phone, phoneNormalized]
            );

            userId = (ins as any).insertId;
        } else {
            // ako user već postoji, osveži ime i originalni format telefona
            await db.query(
                `
                UPDATE users
                SET name = ?, phone = ?, phone_normalized = ?
                WHERE id = ?
                `,
                [name, phone, phoneNormalized, userId]
            );
        }

        // 2) exclude postojeće credentiale za tog usera
        const [crows] = await db.query(
            "SELECT credential_id FROM webauthn_credentials WHERE user_id = ?",
            [userId]
        );

        const excludeCredentials = (crows as any[]).map((c) => ({
            id: c.credential_id,
            type: "public-key" as const,
        }));

        const rpID = process.env.RP_ID!;
        const origin = process.env.ORIGIN!;

        // v13: userID mora biti Uint8Array
        const userID = new TextEncoder().encode(String(userId));

        const options = await generateRegistrationOptions({
            rpName: "ZakaziTermin",
            rpID,
            userID,
            userName: phoneNormalized,
            attestationType: "none",
            excludeCredentials,
            authenticatorSelection: {
                residentKey: "preferred",
                userVerification: "preferred",
            },
        });

        // 3) sačuvaj challenge u session za verify korak
        (req.session as any).webauthn = {
            challenge: options.challenge,
            userId,
            origin,
            rpID,
        };

        res.json(options);
    } catch (err: any) {
        console.error("REGISTER OPTIONS ERROR:", err);

        if (err?.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Ovaj broj telefona je već registrovan.",
                code: "PHONE_ALREADY_EXISTS",
            });
        }

        res.status(500).json({ message: "Register options failed" });
    }
});

app.post("/auth/register/verify", async (req: Request, res: Response) => {
    try {
        const sess = (req.session as any).webauthn;
        if (!sess?.challenge || !sess?.userId) {
            return res.status(400).json({ message: "No challenge in session" });
        }

        const { challenge, userId, origin, rpID } = sess;

        const verification = await verifyRegistrationResponse({
            response: req.body,
            expectedChallenge: challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });

        if (!verification.verified || !verification.registrationInfo) {
            return res.status(400).json({ message: "Not verified" });
        }

        function toBase64url(input: ArrayBuffer | Uint8Array) {
            const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
            const base64 = Buffer.from(bytes).toString("base64");
            return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
        }

        const { credential } = verification.registrationInfo;
        const publicKeyB64u = toBase64url(credential.publicKey);


        await db.query(
            `INSERT INTO webauthn_credentials(user_id, credential_id, public_key, counter, transports)
   VALUES (?, ?, ?, ?, ?)`,
            [
                userId,
                credential.id,
                publicKeyB64u,
                credential.counter,
                JSON.stringify(credential.transports ?? []),
            ]
        );

        (req.session as any).userId = userId;
        delete (req.session as any).webauthn;

        res.json({ ok: true });
    } catch (err: any) {
        console.error("REGISTER VERIFY ERROR:", err);
        return res.status(400).json({
            message: "Registration verification failed",
            error: err?.message ?? String(err),
        });
    }
});

app.post("/auth/login/options", async (req: Request, res: Response) => {
    try {
        const { phone } = req.body as { phone: string };

        if (!phone) {
            return res.status(400).json({
                message: "Missing phone",
                code: "MISSING_PHONE",
            });
        }

        const phoneNormalized = normalizeSerbianPhone(phone);

        const [urows] = await db.query(
            `
            SELECT id
            FROM users
            WHERE phone_normalized = ?
            LIMIT 1
            `,
            [phoneNormalized]
        );

        const userId = (urows as any[])[0]?.id as number | undefined;

        if (!userId) {
            return res.status(404).json({
                message: "User not found",
                code: "USER_NOT_FOUND",
            });
        }

        const [crows] = await db.query(
            `
            SELECT credential_id
            FROM webauthn_credentials
            WHERE user_id = ?
            `,
            [userId]
        );

        const credentials = crows as any[];

        if (credentials.length === 0) {
            return res.status(404).json({
                message: "No credentials for this user",
                code: "NO_CREDENTIALS",
            });
        }

        const allowCredentials = credentials.map((c) => ({
            id: c.credential_id,
            type: "public-key" as const,
        }));

        const rpID = process.env.RP_ID!;
        const origin = process.env.ORIGIN!;

        const options = await generateAuthenticationOptions({
            rpID,
            allowCredentials,
            userVerification: "preferred",
        });

        (req.session as any).webauthn = {
            challenge: options.challenge,
            userId,
            origin,
            rpID,
        };

        res.json(options);
    } catch (err: any) {
        console.error("LOGIN OPTIONS ERROR:", err);

        res.status(500).json({
            message: "Login options failed",
            code: "LOGIN_OPTIONS_FAILED",
            error: err?.message ?? String(err),
        });
    }
});
app.post("/auth/login/verify", async (req: Request, res: Response) => {
    try {
        const sess = (req.session as any).webauthn;

        if (!sess?.challenge || !sess?.userId) {
            return res.status(400).json({
                message: "No challenge in session",
                code: "NO_CHALLENGE",
            });
        }

        const { challenge, userId, origin, rpID } = sess;

        const credentialId = req.body?.id;

        if (!credentialId) {
            return res.status(400).json({
                message: "Missing credential id",
                code: "MISSING_CREDENTIAL_ID",
            });
        }

        const [crows] = await db.query(
            `
            SELECT id, credential_id, public_key, counter
            FROM webauthn_credentials
            WHERE user_id = ?
              AND credential_id = ?
            LIMIT 1
            `,
            [userId, credentialId]
        );

        const cred = (crows as any[])[0];

        if (!cred) {
            return res.status(409).json({
                message: "Credential not found",
                code: "CREDENTIAL_NOT_FOUND",
            });
        }

        const verification = await verifyAuthenticationResponse({
            response: req.body,
            expectedChallenge: challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            credential: {
                id: cred.credential_id,
                publicKey: fromBase64url(cred.public_key),
                counter: cred.counter,
            },
        });

        if (!verification.verified || !verification.authenticationInfo) {
            return res.status(400).json({
                message: "Not verified",
                code: "NOT_VERIFIED",
            });
        }

        await db.query(
            `
            UPDATE webauthn_credentials
            SET counter = ?
            WHERE id = ?
            `,
            [
                verification.authenticationInfo.newCounter,
                cred.id,
            ]
        );

        (req.session as any).userId = userId;
        delete (req.session as any).webauthn;

        res.json({
            ok: true,
        });
    } catch (err: any) {
        console.error("LOGIN VERIFY ERROR:", err);

        res.status(400).json({
            message: "Login verification failed",
            code: "LOGIN_VERIFICATION_FAILED",
            error: err?.message ?? String(err),
        });
    }
});

app.get('/appointments/my', async (req: Request, res: Response) => {
    try {
        const userId = (req.session as any).userId as number | undefined;
        const tenantId = Number(req.query.tenant_id);

        if (!userId) {
            return res.status(401).json({
                message: 'Moraš biti ulogovan',
                code: 'NOT_AUTHENTICATED'
            });
        }

        if (!tenantId) {
            return res.status(400).json({
                message: 'Nedostaje tenant_id',
                code: 'MISSING_TENANT_ID'
            });
        }

        const [rows]: any = await db.query(
            `
            SELECT 
                a.id,
                a.tenant_id,
                a.customer_id,
                a.barber_id,
                a.start_time,
                a.end_time,
                a.status,
                b.name AS barber_name,
                c.name AS customer_name,
                c.phone AS customer_phone
            FROM appointments a
            INNER JOIN customers c ON c.id = a.customer_id
            INNER JOIN barbers b ON b.id = a.barber_id
            WHERE a.tenant_id = ?
              AND c.user_id = ?
              AND a.status IN ('pending', 'confirmed')
              AND a.start_time >= NOW()
            ORDER BY a.start_time ASC
            `,
            [tenantId, userId]
        );

        res.json({
            appointments: rows
        });
    } catch (err) {
        console.error('GET MY APPOINTMENTS ERROR:', err);

        res.status(500).json({
            message: 'Greška pri učitavanju termina',
            code: 'MY_APPOINTMENTS_FAILED'
        });
    }
});


app.patch('/appointments/:appointmentId/cancel', async (req: Request, res: Response) => {
    const conn = await db.getConnection();

    try {
        const userId = (req.session as any).userId as number | undefined;
        const appointmentId = Number(req.params.appointmentId);

        if (!userId) {
            return res.status(401).json({
                message: 'Moraš biti ulogovan',
                code: 'NOT_AUTHENTICATED'
            });
        }

        if (!appointmentId) {
            return res.status(400).json({
                message: 'Nedostaje appointment id',
                code: 'MISSING_APPOINTMENT_ID'
            });
        }

        await conn.beginTransaction();

        const [rows]: any = await conn.query(
            `
            SELECT 
                a.id,
                a.status,
                a.start_time,
                c.user_id
            FROM appointments a
            INNER JOIN customers c ON c.id = a.customer_id
            WHERE a.id = ?
            LIMIT 1
            FOR UPDATE
            `,
            [appointmentId]
        );

        if (rows.length === 0) {
            await conn.rollback();

            return res.status(404).json({
                message: 'Termin nije pronađen',
                code: 'APPOINTMENT_NOT_FOUND'
            });
        }

        const appointment = rows[0];

        if (appointment.user_id !== userId) {
            await conn.rollback();

            return res.status(403).json({
                message: 'Nemaš dozvolu da otkažeš ovaj termin',
                code: 'FORBIDDEN'
            });
        }

        if (!['pending', 'confirmed'].includes(appointment.status)) {
            await conn.rollback();

            return res.status(409).json({
                message: 'Termin više nije aktivan',
                code: 'APPOINTMENT_NOT_ACTIVE'
            });
        }

        const appointmentTime = new Date(appointment.start_time).getTime();
        const now = Date.now();

        if (appointmentTime <= now) {
            await conn.rollback();

            return res.status(409).json({
                message: 'Ne možeš otkazati termin koji je već prošao',
                code: 'APPOINTMENT_ALREADY_PASSED'
            });
        }

        await conn.query(
            `
            UPDATE appointments
            SET status = 'cancelled'
            WHERE id = ?
            `,
            [appointmentId]
        );

        await conn.commit();

        res.json({
            message: 'Termin je uspešno otkazan',
            appointment_id: appointmentId
        });
    } catch (err) {
        await conn.rollback();

        console.error('CANCEL APPOINTMENT ERROR:', err);

        res.status(500).json({
            message: 'Greška pri otkazivanju termina',
            code: 'CANCEL_APPOINTMENT_FAILED'
        });
    } finally {
        conn.release();
    }
});

async function getOrCreateCustomerForTenant({
    tenantId,
    userId,
    name,
    phone,
}: {
    tenantId: number;
    userId: number;
    name: string;
    phone: string;
}) {
    const phoneNormalized = normalizeSerbianPhone(phone);

    const [existingRows] = await db.query(
        `
        SELECT id
        FROM customers
        WHERE tenant_id = ?
          AND user_id = ?
        LIMIT 1
        `,
        [tenantId, userId]
    );

    const existingCustomer = (existingRows as any[])[0];

    if (existingCustomer) {
        await db.query(
            `
            UPDATE customers
            SET name = ?, phone = ?, phone_normalized = ?
            WHERE id = ?
            `,
            [name, phone, phoneNormalized, existingCustomer.id]
        );

        return existingCustomer.id as number;
    }

    const [phoneRows] = await db.query(
        `
        SELECT id
        FROM customers
        WHERE tenant_id = ?
          AND phone_normalized = ?
        LIMIT 1
        `,
        [tenantId, phoneNormalized]
    );

    const customerByPhone = (phoneRows as any[])[0];

    if (customerByPhone) {
        await db.query(
            `
            UPDATE customers
            SET user_id = ?, name = ?, phone = ?
            WHERE id = ?
            `,
            [userId, name, phone, customerByPhone.id]
        );

        return customerByPhone.id as number;
    }

    const [insertResult] = await db.query(
        `
        INSERT INTO customers (
            tenant_id,
            user_id,
            name,
            phone,
            phone_normalized
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [tenantId, userId, name, phone, phoneNormalized]
    );

    return (insertResult as any).insertId as number;
}

app.get('/auth/me', async (req: Request, res: Response) => {
    try {
        const userId = (req.session as any).userId;

        if (!userId) {
            return res.json({
                loggedIn: false,
                user: null
            });
        }

        const [rows]: any = await db.query(
            `
      SELECT id, name, phone
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
            [userId]
        );

        if (rows.length === 0) {
            return res.json({
                loggedIn: false,
                user: null
            });
        }

        return res.json({
            loggedIn: true,
            user: rows[0]
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            loggedIn: false,
            user: null,
            message: 'Greška pri proveri korisnika'
        });
    }
});

app.post("/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.json({ ok: true });
    });
});

export function normalizeSerbianPhone(phone: string) {
    let p = phone.trim();

    // uklanja razmake, crtice, zagrade
    p = p.replace(/[\s\-()]/g, "");

    // 00381... -> +381...
    if (p.startsWith("00381")) {
        p = "+381" + p.slice(5);
    }

    // 06... -> +3816...
    if (p.startsWith("0")) {
        p = "+381" + p.slice(1);
    }

    // 381... -> +381...
    if (p.startsWith("381")) {
        p = "+" + p;
    }

    return p;
}


//Working Hours Prikaz + Edit
app.get('/tenants/:tenantId/working-hours', async (req: Request, res: Response) => {
    console.log('WORKING HOURS ROUTE HIT');

    try {
        const tenantId = req.params.tenantId;

        const [rows] = await db.query(
            `SELECT * 
             FROM tenant_working_hours 
             WHERE tenant_id = ? 
             ORDER BY day_of_week ASC`,
            [tenantId]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.put('/tenants/:tenantId/working-hours/:dayOfWeek', async (req: Request, res: Response) => {
    try {
        const tenantId = req.params.tenantId;
        const dayOfWeek = req.params.dayOfWeek;

        const { is_working, start_time, end_time } = req.body;

        // validacija
        if (is_working) {
            if (!start_time || !end_time) {
                return res.status(400).json({ message: 'Start i end time su obavezni' });
            }

            if (start_time >= end_time) {
                return res.status(400).json({ message: 'Start mora biti manji od end vremena' });
            }
        }

        const [result] = await db.query(
            `
            UPDATE tenant_working_hours
            SET 
                is_working = ?,
                start_time = ?,
                end_time = ?
            WHERE tenant_id = ? AND day_of_week = ?
            `,
            [
                is_working ? 1 : 0,
                is_working ? start_time : null,
                is_working ? end_time : null,
                tenantId,
                dayOfWeek
            ]
        );

        res.json({ message: 'Uspešno ažurirano' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška baze' });
    }
});

//Wokring Hours Override Prikaz + ADD + Delete + Edit
app.get('/tenants/:tenantId/working-overrides', async (req: Request, res: Response) => {
    try {
        const tenantId = req.params.tenantId;

        const [rows] = await db.query(
            `
            SELECT * 
            FROM tenant_working_overrides
            WHERE tenant_id = ?
            ORDER BY start_date DESC
            `,
            [tenantId]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.post('/tenants/:tenantId/working-overrides', async (req: Request, res: Response) => {
    try {
        const tenantId = req.params.tenantId;

        const { start_date, end_date, is_closed, start_time, end_time } = req.body;

        // 🔹 validacija datuma
        if (!start_date || !end_date) {
            return res.status(400).json({ message: 'Start i end date su obavezni' });
        }

        if (start_date > end_date) {
            return res.status(400).json({ message: 'Start date mora biti pre end date' });
        }

        // 🔹 validacija vremena
        if (!is_closed) {
            if (!start_time || !end_time) {
                return res.status(400).json({ message: 'Start i end time su obavezni' });
            }

            if (start_time >= end_time) {
                return res.status(400).json({ message: 'Start mora biti manji od end vremena' });
            }
        }

        // 🔹 provera preklapanja
        const [existing] = await db.query(
            `
            SELECT id 
            FROM tenant_working_overrides
            WHERE tenant_id = ?
              AND start_date <= ?
              AND end_date >= ?
            LIMIT 1
            `,
            [tenantId, end_date, start_date]
        );

        if ((existing as any[]).length > 0) {
            return res.status(400).json({ message: 'Postoji već override u tom periodu' });
        }

        // 🔹 insert
        await db.query(
            `
            INSERT INTO tenant_working_overrides
            (tenant_id, start_date, end_date, is_closed, start_time, end_time)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                tenantId,
                start_date,
                end_date,
                is_closed ? 1 : 0,
                is_closed ? null : start_time,
                is_closed ? null : end_time
            ]
        );

        res.json({ message: 'Override uspešno dodat' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška baze' });
    }
});

app.delete('/tenants/:tenantId/working-overrides/:overrideId', async (req: Request, res: Response) => {
    try {
        const tenantId = req.params.tenantId;
        const overrideId = req.params.overrideId;

        const [result]: any = await db.query(
            `
            DELETE FROM tenant_working_overrides
            WHERE id = ? AND tenant_id = ?
            `,
            [overrideId, tenantId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Override nije pronađen' });
        }

        res.json({ message: 'Override uspešno obrisan' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška baze' });
    }
});

app.put('/tenants/:tenantId/working-overrides/:overrideId', async (req: Request, res: Response) => {
    try {
        const tenantId = req.params.tenantId;
        const overrideId = req.params.overrideId;

        const { start_date, end_date, is_closed, start_time, end_time } = req.body;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: 'Start i end date su obavezni' });
        }

        if (start_date > end_date) {
            return res.status(400).json({ message: 'Start date mora biti pre end date' });
        }

        if (!is_closed) {
            if (!start_time || !end_time) {
                return res.status(400).json({ message: 'Start i end time su obavezni' });
            }

            if (start_time >= end_time) {
                return res.status(400).json({ message: 'Start mora biti manji od end vremena' });
            }
        }

        const [existing] = await db.query(
            `
            SELECT id
            FROM tenant_working_overrides
            WHERE tenant_id = ?
              AND id != ?
              AND start_date <= ?
              AND end_date >= ?
            LIMIT 1
            `,
            [tenantId, overrideId, end_date, start_date]
        );

        if ((existing as any[]).length > 0) {
            return res.status(400).json({ message: 'Postoji već override u tom periodu' });
        }

        const [result]: any = await db.query(
            `
            UPDATE tenant_working_overrides
            SET
                start_date = ?,
                end_date = ?,
                is_closed = ?,
                start_time = ?,
                end_time = ?
            WHERE id = ? AND tenant_id = ?
            `,
            [
                start_date,
                end_date,
                is_closed ? 1 : 0,
                is_closed ? null : start_time,
                is_closed ? null : end_time,
                overrideId,
                tenantId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Override nije pronađen' });
        }

        res.json({ message: 'Override uspešno ažuriran' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška baze' });
    }
});

app.get('/tenants/:tenantId/barbers/:barberId/final-working-hours', async (req, res) => {
    try {
        const tenantId = Number(req.params.tenantId);
        const barberId = Number(req.params.barberId);
        const date = String(req.query.date || '');

        const result = await getFinalBarberWorkingHoursForDate(tenantId, barberId, date);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

//Barber Working Hours
app.get('/barbers/:barberId/working-hours', async (req: Request, res: Response) => {
    try {
        const barberId = req.params.barberId;

        const [rows] = await db.query(
            `
            SELECT *
            FROM barber_working_hours
            WHERE barber_id = ?
            ORDER BY day_of_week ASC
            `,
            [barberId]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.put('/barbers/:barberId/working-hours/:dayOfWeek', async (req: Request, res: Response) => {
    try {
        const barberId = req.params.barberId;
        const dayOfWeek = req.params.dayOfWeek;

        const { is_working, start_time, end_time } = req.body;

        if (is_working) {
            if (!start_time || !end_time) {
                return res.status(400).json({ message: 'Start i end time su obavezni' });
            }

            if (start_time >= end_time) {
                return res.status(400).json({ message: 'Start mora biti manji od end vremena' });
            }
        }

        const [result]: any = await db.query(
            `
            UPDATE barber_working_hours
            SET
                is_working = ?,
                start_time = ?,
                end_time = ?
            WHERE barber_id = ? AND day_of_week = ?
            `,
            [
                is_working ? 1 : 0,
                is_working ? start_time : null,
                is_working ? end_time : null,
                barberId,
                dayOfWeek
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Radno vreme nije pronadjeno' });
        }

        res.json({ message: 'Barber working hours uspesno azuriran' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.get('/barbers/:barberId/working-hours-for-date', async (req, res) => {
    try {
        const barberId = Number(req.params.barberId);
        const date = String(req.query.date || '');

        console.log('barberId:', barberId);
        console.log('date:', date);

        if (!barberId || !date) {
            return res.status(400).json({
                message: 'Prosledi barberId i date. Primer: /barbers/8/working-hours-for-date?date=2026-04-06'
            });
        }

        const result = await getBarberWorkingHoursForDate(barberId, date);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.get('/barbers/:barberId/working-overrides', async (req: Request, res: Response) => {
    try {
        const barberId = req.params.barberId;

        const [rows] = await db.query(
            `
            SELECT *
            FROM barber_working_overrides
            WHERE barber_id = ?
            ORDER BY start_date DESC, id DESC
            `,
            [barberId]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.post('/barbers/:barberId/working-overrides', async (req: Request, res: Response) => {
    try {
        const barberId = req.params.barberId;
        const { start_date, end_date, is_closed, start_time, end_time } = req.body;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: 'Start i end date su obavezni' });
        }

        if (start_date > end_date) {
            return res.status(400).json({ message: 'Start date mora biti pre end date' });
        }

        if (!is_closed) {
            if (!start_time || !end_time) {
                return res.status(400).json({ message: 'Start i end time su obavezni' });
            }

            if (start_time >= end_time) {
                return res.status(400).json({ message: 'Start mora biti manji od end vremena' });
            }
        }

        const [existing]: any = await db.query(
            `
            SELECT id
            FROM barber_working_overrides
            WHERE barber_id = ?
              AND start_date <= ?
              AND end_date >= ?
            LIMIT 1
            `,
            [barberId, end_date, start_date]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Postoji vec override u tom periodu' });
        }

        await db.query(
            `
            INSERT INTO barber_working_overrides
            (barber_id, start_date, end_date, is_closed, start_time, end_time)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                barberId,
                start_date,
                end_date,
                is_closed ? 1 : 0,
                is_closed ? null : start_time,
                is_closed ? null : end_time
            ]
        );

        res.json({ message: 'Barber override uspesno dodat' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.put('/barbers/:barberId/working-overrides/:overrideId', async (req: Request, res: Response) => {
    try {
        const barberId = req.params.barberId;
        const overrideId = req.params.overrideId;

        const { start_date, end_date, is_closed, start_time, end_time } = req.body;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: 'Start i end date su obavezni' });
        }

        if (start_date > end_date) {
            return res.status(400).json({ message: 'Start date mora biti pre end date' });
        }

        if (!is_closed) {
            if (!start_time || !end_time) {
                return res.status(400).json({ message: 'Start i end time su obavezni' });
            }

            if (start_time >= end_time) {
                return res.status(400).json({ message: 'Start mora biti manji od end vremena' });
            }
        }

        const [existing]: any = await db.query(
            `
            SELECT id
            FROM barber_working_overrides
            WHERE barber_id = ?
              AND id != ?
              AND start_date <= ?
              AND end_date >= ?
            LIMIT 1
            `,
            [barberId, overrideId, end_date, start_date]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Postoji vec override u tom periodu' });
        }

        const [result]: any = await db.query(
            `
            UPDATE barber_working_overrides
            SET
                start_date = ?,
                end_date = ?,
                is_closed = ?,
                start_time = ?,
                end_time = ?
            WHERE id = ? AND barber_id = ?
            `,
            [
                start_date,
                end_date,
                is_closed ? 1 : 0,
                is_closed ? null : start_time,
                is_closed ? null : end_time,
                overrideId,
                barberId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Override nije pronadjen' });
        }

        res.json({ message: 'Barber override uspesno azuriran' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.delete('/barbers/:barberId/working-overrides/:overrideId', async (req: Request, res: Response) => {
    try {
        const barberId = req.params.barberId;
        const overrideId = req.params.overrideId;

        const [result]: any = await db.query(
            `
            DELETE FROM barber_working_overrides
            WHERE id = ? AND barber_id = ?
            `,
            [overrideId, barberId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Override nije pronadjen' });
        }

        res.json({ message: 'Barber override uspesno obrisan' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.get('/tenants/:tenantId/bookable-days', async (req: Request, res: Response) => {
    try {
        const tenantId = Number(req.params.tenantId);
        const days = Number(req.query.days || 14);

        if (!tenantId) {
            return res.status(400).json({ message: 'tenantId je obavezan' });
        }

        const [rows]: any = await db.query(
            `
            SELECT day_of_week, is_working
            FROM tenant_working_hours
            WHERE tenant_id = ?
            `,
            [tenantId]
        );

        const workingDays = new Set(
            rows
                .filter((row: any) => row.is_working === 1 || row.is_working === true)
                .map((row: any) => row.day_of_week)
        );

        const result: string[] = [];

        const start = new Date();
        start.setDate(start.getDate() + 1);

        function toDateString(date: Date) {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');

            return `${y}-${m}-${d}`;
        }

        for (let i = 0; result.length < days && i < 60; i++) {
            const current = new Date(start);
            current.setDate(start.getDate() + i);

            const dateStr = toDateString(current);

            // prvo proveri override
            const [overrideRows]: any = await db.query(
                `
                SELECT is_closed
                FROM tenant_working_overrides
                WHERE tenant_id = ?
                  AND ? BETWEEN start_date AND end_date
                LIMIT 1
                `,
                [tenantId, dateStr]
            );

            if (overrideRows.length > 0) {
                const override = overrideRows[0];

                if (override.is_closed === 1 || override.is_closed === true) {
                    continue; // zatvoren → skip
                }

                // otvoren override → ubaci dan
                result.push(dateStr);
                continue;
            }

            // nema override → koristi default radno vreme
            const dayOfWeek = current.getDay();

            if (!workingDays.has(dayOfWeek)) continue;

            result.push(dateStr);
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri učitavanju dostupnih dana' });
    }
});


//HELPER FUNKCIJE PAUZE
function toDateOnly(dateString: string) {
    return new Date(`${dateString}T00:00:00`);
}

function isDateBetween(targetDate: string, startDate: string, endDate: string | null) {
    const target = toDateOnly(targetDate).getTime();
    const start = toDateOnly(startDate).getTime();

    if (target < start) return false;
    if (!endDate) return true;

    const end = toDateOnly(endDate).getTime();
    return target <= end;
}

function timeRangesOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string
) {
    return startA < endB && endA > startB;
}

function getDayOfWeekFromDate(date: string) {
    return new Date(date).getDay(); // 0=nedelja ... 6=subota
}

function doesBreakApplyToDate(
    breakItem: any,
    date: string,
    repeatDays: number[]
) {
    if (!normalizeBool(breakItem.is_active)) return false;

    if (breakItem.repeat_type === 'none') {
        return breakItem.break_date === date;
    }

    if (breakItem.repeat_type === 'daily') {
        return isDateBetween(date, breakItem.break_date, breakItem.repeat_until);
    }

    if (breakItem.repeat_type === 'weekly') {
        if (!isDateBetween(date, breakItem.break_date, breakItem.repeat_until)) {
            return false;
        }

        const dayOfWeek = getDayOfWeekFromDate(date);
        return repeatDays.includes(dayOfWeek);
    }

    return false;
}

function isBreakPast(breakItem: any, today: string) {
    if (!normalizeBool(breakItem.is_active)) return false;

    if (breakItem.repeat_type === 'none') {
        return breakItem.break_date < today;
    }

    if (breakItem.repeat_type === 'daily' || breakItem.repeat_type === 'weekly') {
        if (!breakItem.repeat_until) return false;
        return breakItem.repeat_until < today;
    }

    return false;
}

function isBreakActiveOrFuture(breakItem: any, today: string) {
    return !isBreakPast(breakItem, today) && normalizeBool(breakItem.is_active);
}

async function getBreakRepeatDaysMap(barberId: number) {
    const [rows]: any = await db.query(
        `
        SELECT brd.break_id, brd.day_of_week
        FROM barber_break_repeat_days brd
        INNER JOIN barber_breaks bb ON bb.id = brd.break_id
        WHERE bb.barber_id = ?
        ORDER BY brd.break_id ASC, brd.day_of_week ASC
        `,
        [barberId]
    );

    const map = new Map<number, number[]>();

    for (const row of rows) {
        if (!map.has(row.break_id)) {
            map.set(row.break_id, []);
        }

        map.get(row.break_id)!.push(row.day_of_week);
    }

    return map;
}

async function checkBreakConflict(
    barberId: number,
    breakDate: string,
    startTime: string,
    endTime: string,
    breakIdToIgnore?: number
) {
    const [rows]: any = await db.query(
        `
        SELECT *
        FROM barber_breaks
        WHERE barber_id = ?
          AND repeat_type = 'none'
          AND break_date = ?
          ${breakIdToIgnore ? 'AND id != ?' : ''}
        `,
        breakIdToIgnore
            ? [barberId, breakDate, breakIdToIgnore]
            : [barberId, breakDate]
    );

    return rows.some((row: any) =>
        timeRangesOverlap(startTime, endTime, row.start_time, row.end_time)
    );
}

app.get('/barbers/:barberId/breaks', async (req: Request, res: Response) => {
    try {
        const barberId = Number(req.params.barberId);
        const selectedDate = String(req.query.date || '');
        const today = new Date().toISOString().slice(0, 10);

        if (!barberId) {
            return res.status(400).json({ message: 'Missing barberId' });
        }

        const effectiveDate = selectedDate || today;

        const [breaks]: any = await db.query(
            `
            SELECT *
            FROM barber_breaks
            WHERE barber_id = ?
            ORDER BY break_date DESC, start_time ASC, id DESC
            `,
            [barberId]
        );

        const repeatDaysMap = await getBreakRepeatDaysMap(barberId);

        const mappedBreaks = breaks.map((item: any) => {
            const repeat_days = repeatDaysMap.get(item.id) || [];

            return {
                ...item,
                repeat_days,
            };
        });

        const today_breaks = mappedBreaks.filter((item: any) =>
            doesBreakApplyToDate(item, effectiveDate, item.repeat_days)
        );

        const active_breaks = mappedBreaks.filter((item: any) =>
            isBreakActiveOrFuture(item, today)
        );

        const past_breaks = mappedBreaks.filter((item: any) =>
            isBreakPast(item, today)
        );

        res.json({
            selected_date: effectiveDate,
            today_breaks,
            active_breaks,
            past_breaks,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.get('/barbers/:barberId/breaks/:breakId', async (req: Request, res: Response) => {
    try {
        const barberId = Number(req.params.barberId);
        const breakId = Number(req.params.breakId);

        const [rows]: any = await db.query(
            `
            SELECT *
            FROM barber_breaks
            WHERE id = ? AND barber_id = ?
            LIMIT 1
            `,
            [breakId, barberId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pauza nije pronadjena' });
        }

        const breakItem = rows[0];

        const [repeatDays]: any = await db.query(
            `
            SELECT day_of_week
            FROM barber_break_repeat_days
            WHERE break_id = ?
            ORDER BY day_of_week ASC
            `,
            [breakId]
        );

        res.json({
            ...breakItem,
            repeat_days: repeatDays.map((d: any) => d.day_of_week),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.post('/barbers/:barberId/breaks', async (req: Request, res: Response) => {
    try {
        const barberId = Number(req.params.barberId);

        const {
            break_date,
            start_time,
            end_time,
            repeat_type,
            repeat_until,
            is_active,
            note,
            repeat_days,
        } = req.body;

        if (!break_date || !start_time || !end_time || !repeat_type) {
            return res.status(400).json({
                message: 'break_date, start_time, end_time i repeat_type su obavezni'
            });
        }

        if (start_time >= end_time) {
            return res.status(400).json({
                message: 'Start mora biti manji od end vremena'
            });
        }

        if (!['none', 'daily', 'weekly'].includes(repeat_type)) {
            return res.status(400).json({
                message: 'Neispravan repeat_type'
            });
        }

        if ((repeat_type === 'daily' || repeat_type === 'weekly') && !repeat_until) {
            return res.status(400).json({
                message: 'repeat_until je obavezan za daily i weekly'
            });
        }

        if (repeat_until && break_date > repeat_until) {
            return res.status(400).json({
                message: 'break_date mora biti pre repeat_until'
            });
        }

        if (repeat_type === 'weekly') {
            if (!Array.isArray(repeat_days) || repeat_days.length === 0) {
                return res.status(400).json({
                    message: 'repeat_days je obavezan za weekly'
                });
            }
        }

        // konflikt proveravamo samo za one-time za sada
        if (repeat_type === 'none') {
            const hasConflict = await checkBreakConflict(
                barberId,
                break_date,
                start_time,
                end_time
            );

            if (hasConflict) {
                return res.status(400).json({
                    message: 'Postoji vec pauza koja se preklapa u tom terminu'
                });
            }
        }

        const [result]: any = await db.query(
            `
            INSERT INTO barber_breaks
            (
                barber_id,
                break_date,
                start_time,
                end_time,
                repeat_type,
                repeat_until,
                is_active,
                note
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                barberId,
                break_date,
                start_time,
                end_time,
                repeat_type,
                repeat_until || null,
                is_active ? 1 : 0,
                note || null,
            ]
        );

        const breakId = result.insertId;

        if (repeat_type === 'weekly' && Array.isArray(repeat_days) && repeat_days.length > 0) {
            const values = repeat_days.flatMap((day: number) => [breakId, day]);

            await db.query(
                `
                INSERT INTO barber_break_repeat_days (break_id, day_of_week)
                VALUES ${repeat_days.map(() => '(?, ?)').join(', ')}
                `,
                values
            );
        }

        res.json({
            message: 'Pauza uspesno dodata',
            break_id: breakId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.put('/barbers/:barberId/breaks/:breakId', async (req: Request, res: Response) => {
    try {
        const barberId = Number(req.params.barberId);
        const breakId = Number(req.params.breakId);

        const {
            break_date,
            start_time,
            end_time,
            repeat_type,
            repeat_until,
            is_active,
            note,
            repeat_days,
        } = req.body;

        if (!break_date || !start_time || !end_time || !repeat_type) {
            return res.status(400).json({
                message: 'break_date, start_time, end_time i repeat_type su obavezni'
            });
        }

        if (start_time >= end_time) {
            return res.status(400).json({
                message: 'Start mora biti manji od end vremena'
            });
        }

        if (!['none', 'daily', 'weekly'].includes(repeat_type)) {
            return res.status(400).json({
                message: 'Neispravan repeat_type'
            });
        }

        if ((repeat_type === 'daily' || repeat_type === 'weekly') && !repeat_until) {
            return res.status(400).json({
                message: 'repeat_until je obavezan za daily i weekly'
            });
        }

        if (repeat_until && break_date > repeat_until) {
            return res.status(400).json({
                message: 'break_date mora biti pre repeat_until'
            });
        }

        if (repeat_type === 'weekly') {
            if (!Array.isArray(repeat_days) || repeat_days.length === 0) {
                return res.status(400).json({
                    message: 'repeat_days je obavezan za weekly'
                });
            }
        }

        if (repeat_type === 'none') {
            const hasConflict = await checkBreakConflict(
                barberId,
                break_date,
                start_time,
                end_time,
                breakId
            );

            if (hasConflict) {
                return res.status(400).json({
                    message: 'Postoji vec pauza koja se preklapa u tom terminu'
                });
            }
        }

        const [result]: any = await db.query(
            `
            UPDATE barber_breaks
            SET
                break_date = ?,
                start_time = ?,
                end_time = ?,
                repeat_type = ?,
                repeat_until = ?,
                is_active = ?,
                note = ?
            WHERE id = ? AND barber_id = ?
            `,
            [
                break_date,
                start_time,
                end_time,
                repeat_type,
                repeat_until || null,
                is_active ? 1 : 0,
                note || null,
                breakId,
                barberId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pauza nije pronadjena' });
        }

        await db.query(
            `DELETE FROM barber_break_repeat_days WHERE break_id = ?`,
            [breakId]
        );

        if (repeat_type === 'weekly' && Array.isArray(repeat_days) && repeat_days.length > 0) {
            const values = repeat_days.flatMap((day: number) => [breakId, day]);

            await db.query(
                `
                INSERT INTO barber_break_repeat_days (break_id, day_of_week)
                VALUES ${repeat_days.map(() => '(?, ?)').join(', ')}
                `,
                values
            );
        }

        res.json({ message: 'Pauza uspesno azurirana' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.delete('/barbers/:barberId/breaks/:breakId', async (req: Request, res: Response) => {
    try {
        const barberId = Number(req.params.barberId);
        const breakId = Number(req.params.breakId);

        const [result]: any = await db.query(
            `
            DELETE FROM barber_breaks
            WHERE id = ? AND barber_id = ?
            `,
            [breakId, barberId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pauza nije pronadjena' });
        }

        res.json({ message: 'Pauza uspesno obrisana' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});

app.get('/barbers/:barberId/breaks-for-date', async (req: Request, res: Response) => {
    try {
        const barberId = Number(req.params.barberId);
        const date = String(req.query.date || '');

        if (!date) {
            return res.status(400).json({ message: 'date je obavezan' });
        }

        const [breaks]: any = await db.query(
            `
            SELECT *
            FROM barber_breaks
            WHERE barber_id = ?
            ORDER BY start_time ASC, id ASC
            `,
            [barberId]
        );

        const repeatDaysMap = await getBreakRepeatDaysMap(barberId);

        const result = breaks
            .map((item: any) => ({
                ...item,
                repeat_days: repeatDaysMap.get(item.id) || [],
            }))
            .filter((item: any) =>
                doesBreakApplyToDate(item, date, item.repeat_days)
            );

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greska baze' });
    }
});


app.get('/auth/admin/me', async (req: Request, res: Response) => {
    try {
        const userId = (req.session as any).userId as number | undefined;
        const tenantSlug = String(req.query.tenantSlug || '');

        if (!userId) {
            return res.status(401).json({
                message: 'Nisi ulogovan',
                code: 'NOT_AUTHENTICATED'
            });
        }

        if (!tenantSlug) {
            return res.status(400).json({
                message: 'Nedostaje tenantSlug',
                code: 'MISSING_TENANT_SLUG'
            });
        }

        const [rows]: any = await db.query(
            `
            SELECT 
                u.id AS user_id,
                u.name,
                u.phone,
                t.id AS tenant_id,
                t.name AS tenant_name,
                t.slug,
                ts.role,
                ts.is_active
            FROM tenant_staff ts
            INNER JOIN users u ON u.id = ts.user_id
            INNER JOIN tenants t ON t.id = ts.tenant_id
            WHERE ts.user_id = ?
              AND t.slug = ?
              AND ts.is_active = TRUE
            LIMIT 1
            `,
            [userId, tenantSlug]
        );

        if (rows.length === 0) {
            return res.status(403).json({
                message: 'Nemaš pristup admin panelu za ovaj lokal',
                code: 'ADMIN_ACCESS_DENIED'
            });
        }

        const staff = rows[0];

        res.json({
            isAdmin: true,
            user: {
                id: staff.user_id,
                name: staff.name,
                phone: staff.phone
            },
            tenant: {
                id: staff.tenant_id,
                name: staff.tenant_name,
                slug: staff.slug
            },
            role: staff.role
        });
    } catch (err) {
        console.error('ADMIN ME ERROR:', err);

        res.status(500).json({
            message: 'Greška pri proveri admin pristupa',
            code: 'ADMIN_ME_FAILED'
        });
    }
});

const tenantAdminRouter = express.Router({ mergeParams: true });

tenantAdminRouter.get('/ping', async (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'Admin API radi',
        staff: (req as any).tenantStaff
    });
});

app.use(
    '/tenants/:tenantSlug/admin',
    requireTenantStaff(['owner', 'admin', 'barber']),
    tenantAdminRouter
);

/////////// SETTINGS ////////////////////
tenantAdminRouter.get('/settings', async (req: Request, res: Response) => {
    const staff = (req as any).tenantStaff;

    res.json({
        ok: true,
        tenant: staff.tenant,
        user: staff.user,
        role: staff.role
    });
});
/////////// KRAJ SETTINGS ////////////////////


/////////// LOKAL /////////////////////
tenantAdminRouter.get(
    '/lokal',
    requireTenantRole(['owner']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;

            const [rows]: any = await db.query(
                `
                SELECT 
                    id,
                    name,
                    slug,
                    phone,
                    email,
                    address,
                    created_at,
                    updated_at
                FROM tenants
                WHERE id = ?
                LIMIT 1
                `,
                [staff.tenant.id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    message: 'Lokal nije pronađen',
                    code: 'TENANT_NOT_FOUND'
                });
            }

            res.json({
                lokal: rows[0]
            });
        } catch (err) {
            console.error('GET LOKAL ERROR:', err);

            res.status(500).json({
                message: 'Greška pri učitavanju lokala',
                code: 'GET_LOKAL_FAILED'
            });
        }
    }
);

tenantAdminRouter.put(
    '/lokal',
    requireTenantRole(['owner']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;

            const {
                name,
                phone,
                email,
                address
            } = req.body as {
                name: string;
                phone: string;
                email?: string | null;
                address?: string | null;
            };

            if (!name || !phone) {
                return res.status(400).json({
                    message: 'Naziv lokala i telefon su obavezni',
                    code: 'MISSING_LOKAL_DATA'
                });
            }

            await db.query(
                `
                UPDATE tenants
                SET 
                    name = ?,
                    phone = ?,
                    email = ?,
                    address = ?
                WHERE id = ?
                `,
                [
                    name.trim(),
                    phone.trim(),
                    email?.trim() || null,
                    address?.trim() || null,
                    staff.tenant.id
                ]
            );

            const [rows]: any = await db.query(
                `
                SELECT 
                    id,
                    name,
                    slug,
                    phone,
                    email,
                    address,
                    created_at,
                    updated_at
                FROM tenants
                WHERE id = ?
                LIMIT 1
                `,
                [staff.tenant.id]
            );

            res.json({
                ok: true,
                message: 'Podaci lokala su uspešno izmenjeni',
                lokal: rows[0]
            });
        } catch (err: any) {
            if (err?.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'Telefon već koristi drugi lokal',
                    code: 'TENANT_PHONE_ALREADY_EXISTS'
                });
            }

            console.error('UPDATE LOKAL ERROR:', err);

            res.status(500).json({
                message: 'Greška pri izmeni lokala',
                code: 'UPDATE_LOKAL_FAILED'
            });
        }
    }
);

/////////// KRAJ LOKAL ////////////////


//////////// USLUGE ///////////////////
tenantAdminRouter.get(
    '/services',
    requireTenantRole(['owner', 'admin']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;
            const includeInactive = String(req.query.includeInactive || '') === 'true';

            const [rows]: any = await db.query(
                `
                SELECT 
                    id,
                    name,
                    description,
                    price,
                    duration_minutes,
                    is_active,
                    created_at,
                    updated_at
                FROM services
                WHERE tenant_id = ?
                  ${includeInactive ? '' : 'AND is_active = TRUE'}
                ORDER BY is_active DESC, id DESC
                `,
                [staff.tenant.id]
            );

            res.json({ services: rows });
        } catch (err) {
            console.error('GET SERVICES ERROR:', err);

            res.status(500).json({
                message: 'Greška pri učitavanju usluga',
                code: 'GET_SERVICES_FAILED'
            });
        }
    }
);

tenantAdminRouter.post(
    '/services',
    requireTenantRole(['owner', 'admin']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;

            const {
                name,
                description,
                price,
                duration_minutes
            } = req.body as {
                name: string;
                description?: string | null;
                price: number;
                duration_minutes: number;
            };

            if (!name || !String(name).trim()) {
                return res.status(400).json({
                    message: 'Naziv usluge je obavezan',
                    code: 'MISSING_SERVICE_NAME'
                });
            }

            const servicePrice = Number(price);
            const duration = Number(duration_minutes);

            if (Number.isNaN(servicePrice) || servicePrice < 0) {
                return res.status(400).json({
                    message: 'Cena nije validna',
                    code: 'INVALID_SERVICE_PRICE'
                });
            }

            if (Number.isNaN(duration) || duration <= 0) {
                return res.status(400).json({
                    message: 'Trajanje usluge nije validno',
                    code: 'INVALID_SERVICE_DURATION'
                });
            }

            const [result]: any = await db.query(
                `
                INSERT INTO services (
                    tenant_id,
                    name,
                    description,
                    price,
                    duration_minutes,
                    is_active
                )
                VALUES (?, ?, ?, ?, ?, TRUE)
                `,
                [
                    staff.tenant.id,
                    name.trim(),
                    description?.trim() || null,
                    servicePrice,
                    duration
                ]
            );

            const [rows]: any = await db.query(
                `
                SELECT 
                    id,
                    name,
                    description,
                    price,
                    duration_minutes,
                    is_active,
                    created_at,
                    updated_at
                FROM services
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [result.insertId, staff.tenant.id]
            );

            res.status(201).json({
                ok: true,
                message: 'Usluga je uspešno dodata',
                service: rows[0]
            });
        } catch (err) {
            console.error('CREATE SERVICE ERROR:', err);

            res.status(500).json({
                message: 'Greška pri dodavanju usluge',
                code: 'CREATE_SERVICE_FAILED'
            });
        }
    }
);

tenantAdminRouter.put(
    '/services/:serviceId',
    requireTenantRole(['owner', 'admin']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;
            const serviceId = Number(req.params.serviceId);

            if (!serviceId) {
                return res.status(400).json({
                    message: 'Nedostaje ID usluge',
                    code: 'MISSING_SERVICE_ID'
                });
            }

            const {
                name,
                description,
                price,
                duration_minutes
            } = req.body as {
                name: string;
                description?: string | null;
                price: number;
                duration_minutes: number;
            };

            if (!name || !String(name).trim()) {
                return res.status(400).json({
                    message: 'Naziv usluge je obavezan',
                    code: 'MISSING_SERVICE_NAME'
                });
            }

            const servicePrice = Number(price);
            const duration = Number(duration_minutes);

            if (Number.isNaN(servicePrice) || servicePrice < 0) {
                return res.status(400).json({
                    message: 'Cena nije validna',
                    code: 'INVALID_SERVICE_PRICE'
                });
            }

            if (Number.isNaN(duration) || duration <= 0) {
                return res.status(400).json({
                    message: 'Trajanje usluge nije validno',
                    code: 'INVALID_SERVICE_DURATION'
                });
            }

            const [existing]: any = await db.query(
                `
                SELECT id
                FROM services
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [serviceId, staff.tenant.id]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    message: 'Usluga nije pronađena',
                    code: 'SERVICE_NOT_FOUND'
                });
            }

            await db.query(
                `
                UPDATE services
                SET 
                    name = ?,
                    description = ?,
                    price = ?,
                    duration_minutes = ?
                WHERE id = ?
                  AND tenant_id = ?
                `,
                [
                    name.trim(),
                    description?.trim() || null,
                    servicePrice,
                    duration,
                    serviceId,
                    staff.tenant.id
                ]
            );

            const [rows]: any = await db.query(
                `
                SELECT 
                    id,
                    name,
                    description,
                    price,
                    duration_minutes,
                    is_active,
                    created_at,
                    updated_at
                FROM services
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [serviceId, staff.tenant.id]
            );

            res.json({
                ok: true,
                message: 'Usluga je uspešno izmenjena',
                service: rows[0]
            });
        } catch (err) {
            console.error('UPDATE SERVICE ERROR:', err);

            res.status(500).json({
                message: 'Greška pri izmeni usluge',
                code: 'UPDATE_SERVICE_FAILED'
            });
        }
    }
);

tenantAdminRouter.delete(
    '/services/:serviceId',
    requireTenantRole(['owner', 'admin']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;
            const serviceId = Number(req.params.serviceId);

            if (!serviceId) {
                return res.status(400).json({
                    message: 'Nedostaje ID usluge',
                    code: 'MISSING_SERVICE_ID'
                });
            }

            const [existing]: any = await db.query(
                `
                SELECT id
                FROM services
                WHERE id = ?
                  AND tenant_id = ?
                  AND is_active = TRUE
                LIMIT 1
                `,
                [serviceId, staff.tenant.id]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    message: 'Usluga nije pronađena',
                    code: 'SERVICE_NOT_FOUND'
                });
            }

            await db.query(
                `
                UPDATE services
                SET is_active = FALSE
                WHERE id = ?
                  AND tenant_id = ?
                `,
                [serviceId, staff.tenant.id]
            );

            res.json({
                ok: true,
                message: 'Usluga je uspešno obrisana'
            });
        } catch (err) {
            console.error('DELETE SERVICE ERROR:', err);

            res.status(500).json({
                message: 'Greška pri brisanju usluge',
                code: 'DELETE_SERVICE_FAILED'
            });
        }
    }
);

tenantAdminRouter.patch(
    '/services/:serviceId/activate',
    requireTenantRole(['owner', 'admin']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;
            const serviceId = Number(req.params.serviceId);

            if (!serviceId) {
                return res.status(400).json({
                    message: 'Nedostaje ID usluge',
                    code: 'MISSING_SERVICE_ID'
                });
            }

            const [existing]: any = await db.query(
                `
                SELECT id
                FROM services
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [serviceId, staff.tenant.id]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    message: 'Usluga nije pronađena',
                    code: 'SERVICE_NOT_FOUND'
                });
            }

            await db.query(
                `
                UPDATE services
                SET is_active = TRUE
                WHERE id = ?
                  AND tenant_id = ?
                `,
                [serviceId, staff.tenant.id]
            );

            res.json({
                ok: true,
                message: 'Usluga je ponovo aktivirana'
            });
        } catch (err) {
            console.error('ACTIVATE SERVICE ERROR:', err);

            res.status(500).json({
                message: 'Greška pri aktiviranju usluge',
                code: 'ACTIVATE_SERVICE_FAILED'
            });
        }
    }
);
///////////// KRAJ USLUGE /////////////



///////////// FRIZERI ///////////////
tenantAdminRouter.get(
    '/barbers',
    requireTenantRole(['owner', 'admin']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;
            const includeInactive = String(req.query.includeInactive || '') === 'true';

            const [rows]: any = await db.query(
                `
                SELECT 
                    id,
                    tenant_id,
                    user_id,
                    name,
                    phone,
                    email,
                    specialty,
                    is_active,
                    created_at,
                    updated_at
                FROM barbers
                WHERE tenant_id = ?
                  ${includeInactive ? '' : 'AND is_active = TRUE'}
                ORDER BY is_active DESC, id DESC
                `,
                [staff.tenant.id]
            );

            res.json({
                barbers: rows
            });
        } catch (err) {
            console.error('GET BARBERS ERROR:', err);

            res.status(500).json({
                message: 'Greška pri učitavanju frizera',
                code: 'GET_BARBERS_FAILED'
            });
        }
    }
);

tenantAdminRouter.post(
    '/barbers',
    requireTenantRole(['owner', 'admin']),
    async (req: Request, res: Response) => {
        const conn = await db.getConnection();

        try {
            const staff = (req as any).tenantStaff;

            const {
                name,
                phone,
                email,
                specialty
            } = req.body as {
                name: string;
                phone?: string | null;
                email?: string | null;
                specialty?: string | null;
            };

            if (!name || !String(name).trim()) {
                return res.status(400).json({
                    message: 'Ime frizera je obavezno',
                    code: 'MISSING_BARBER_NAME'
                });
            }

            await conn.beginTransaction();

            const [tenantHours]: any = await conn.query(
                `
                SELECT 
                    day_of_week,
                    is_working,
                    start_time,
                    end_time
                FROM tenant_working_hours
                WHERE tenant_id = ?
                ORDER BY day_of_week ASC
                `,
                [staff.tenant.id]
            );

            if (tenantHours.length === 0) {
                await conn.rollback();

                return res.status(400).json({
                    message: 'Prvo moraš podesiti radno vreme lokala',
                    code: 'TENANT_WORKING_HOURS_NOT_FOUND'
                });
            }

            const [result]: any = await conn.query(
                `
                INSERT INTO barbers (
                    tenant_id,
                    user_id,
                    name,
                    phone,
                    email,
                    specialty,
                    is_active
                )
                VALUES (?, NULL, ?, ?, ?, ?, FALSE)
                `,
                [
                    staff.tenant.id,
                    name.trim(),
                    phone?.trim() || null,
                    email?.trim() || null,
                    specialty?.trim() || null
                ]
            );

            const newBarberId = result.insertId;

            await conn.query(
                `
                INSERT INTO barber_shift_settings (
                    barber_id,
                    work_mode,
                    rotation_starts_at,
                    is_active
                )
                VALUES (?, 'single_shift', NULL, FALSE)
                `,
                [newBarberId]
            );

            await conn.query(
                `
                INSERT INTO barber_shift_working_hours (
                    barber_id,
                    shift_number,
                    day_of_week,
                    is_working,
                    start_time,
                    end_time
                )
                SELECT
                    ? AS barber_id,
                    1 AS shift_number,
                    day_of_week,
                    is_working,
                    start_time,
                    end_time
                FROM tenant_working_hours
                WHERE tenant_id = ?
                ORDER BY day_of_week ASC
                `,
                [newBarberId, staff.tenant.id]
            );

            const [rows]: any = await conn.query(
                `
                SELECT 
                    id,
                    tenant_id,
                    user_id,
                    name,
                    phone,
                    email,
                    specialty,
                    is_active,
                    created_at,
                    updated_at
                FROM barbers
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [newBarberId, staff.tenant.id]
            );

            await conn.commit();

            res.status(201).json({
                ok: true,
                message: 'Frizer je dodat kao neaktivan. Radno vreme je kopirano iz radnog vremena lokala.',
                barber: rows[0]
            });
        } catch (err) {
            await conn.rollback();

            console.error('CREATE BARBER ERROR:', err);

            res.status(500).json({
                message: 'Greška pri dodavanju frizera',
                code: 'CREATE_BARBER_FAILED'
            });
        } finally {
            conn.release();
        }
    }
);
tenantAdminRouter.put(
    '/barbers/:barberId',
    requireTenantRole(['owner', 'admin']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;
            const barberId = Number(req.params.barberId);

            if (!barberId) {
                return res.status(400).json({
                    message: 'Nedostaje ID frizera',
                    code: 'MISSING_BARBER_ID'
                });
            }

            const {
                name,
                phone,
                email,
                specialty
            } = req.body as {
                name: string;
                phone?: string | null;
                email?: string | null;
                specialty?: string | null;
            };

            if (!name || !String(name).trim()) {
                return res.status(400).json({
                    message: 'Ime frizera je obavezno',
                    code: 'MISSING_BARBER_NAME'
                });
            }

            const [existing]: any = await db.query(
                `
                SELECT id
                FROM barbers
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [barberId, staff.tenant.id]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    message: 'Frizer nije pronađen',
                    code: 'BARBER_NOT_FOUND'
                });
            }

            await db.query(
                `
                UPDATE barbers
                SET 
                    name = ?,
                    phone = ?,
                    email = ?,
                    specialty = ?
                WHERE id = ?
                  AND tenant_id = ?
                `,
                [
                    name.trim(),
                    phone?.trim() || null,
                    email?.trim() || null,
                    specialty?.trim() || null,
                    barberId,
                    staff.tenant.id
                ]
            );

            const [rows]: any = await db.query(
                `
                SELECT 
                    id,
                    tenant_id,
                    user_id,
                    name,
                    phone,
                    email,
                    specialty,
                    is_active,
                    created_at,
                    updated_at
                FROM barbers
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [barberId, staff.tenant.id]
            );

            res.json({
                ok: true,
                message: 'Frizer je uspešno izmenjen',
                barber: rows[0]
            });
        } catch (err) {
            console.error('UPDATE BARBER ERROR:', err);

            res.status(500).json({
                message: 'Greška pri izmeni frizera',
                code: 'UPDATE_BARBER_FAILED'
            });
        }
    }
);

tenantAdminRouter.delete(
    '/barbers/:barberId',
    requireTenantRole(['owner', 'admin']),
    async (req: Request, res: Response) => {
        const conn = await db.getConnection();

        try {
            const staff = (req as any).tenantStaff;
            const barberId = Number(req.params.barberId);

            if (!barberId) {
                return res.status(400).json({
                    message: 'Nedostaje ID frizera',
                    code: 'MISSING_BARBER_ID'
                });
            }

            await conn.beginTransaction();

            const [existing]: any = await conn.query(
                `
                SELECT id
                FROM barbers
                WHERE id = ?
                  AND tenant_id = ?
                  AND is_active = TRUE
                LIMIT 1
                FOR UPDATE
                `,
                [barberId, staff.tenant.id]
            );

            if (existing.length === 0) {
                await conn.rollback();

                return res.status(404).json({
                    message: 'Frizer nije pronađen',
                    code: 'BARBER_NOT_FOUND'
                });
            }

            await conn.query(
                `
                UPDATE barbers
                SET is_active = FALSE
                WHERE id = ?
                  AND tenant_id = ?
                `,
                [barberId, staff.tenant.id]
            );

            await conn.query(
                `
                UPDATE barber_shift_settings
                SET is_active = FALSE
                WHERE barber_id = ?
                `,
                [barberId]
            );

            await conn.commit();

            res.json({
                ok: true,
                message: 'Frizer je deaktiviran'
            });
        } catch (err) {
            await conn.rollback();

            console.error('DELETE BARBER ERROR:', err);

            res.status(500).json({
                message: 'Greška pri deaktiviranju frizera',
                code: 'DELETE_BARBER_FAILED'
            });
        } finally {
            conn.release();
        }
    }
);

tenantAdminRouter.patch(
    '/barbers/:barberId/activate',
    requireTenantRole(['owner', 'admin']),
    async (req: Request, res: Response) => {
        const conn = await db.getConnection();

        try {
            const staff = (req as any).tenantStaff;
            const barberId = Number(req.params.barberId);

            if (!barberId) {
                return res.status(400).json({
                    message: 'Nedostaje ID frizera',
                    code: 'MISSING_BARBER_ID'
                });
            }

            await conn.beginTransaction();

            const [existing]: any = await conn.query(
                `
                SELECT id
                FROM barbers
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                FOR UPDATE
                `,
                [barberId, staff.tenant.id]
            );

            if (existing.length === 0) {
                await conn.rollback();

                return res.status(404).json({
                    message: 'Frizer nije pronađen',
                    code: 'BARBER_NOT_FOUND'
                });
            }

            await conn.query(
                `
                UPDATE barbers
                SET is_active = TRUE
                WHERE id = ?
                  AND tenant_id = ?
                `,
                [barberId, staff.tenant.id]
            );

            await conn.query(
                `
                UPDATE barber_shift_settings
                SET is_active = TRUE
                WHERE barber_id = ?
                `,
                [barberId]
            );

            await conn.commit();

            res.json({
                ok: true,
                message: 'Frizer je ponovo aktiviran'
            });
        } catch (err) {
            await conn.rollback();

            console.error('ACTIVATE BARBER ERROR:', err);

            res.status(500).json({
                message: 'Greška pri aktiviranju frizera',
                code: 'ACTIVATE_BARBER_FAILED'
            });
        } finally {
            conn.release();
        }
    }
);
///////////// KRAJ FRIZERI ////////////



///////////// RADNO VREME /////////////
tenantAdminRouter.get(
    '/working-hours',
    requireTenantRole(['owner']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;

            const [rows]: any = await db.query(
                `
                SELECT
                    id,
                    tenant_id,
                    day_of_week,
                    is_working,
                    start_time,
                    end_time,
                    created_at,
                    updated_at
                FROM tenant_working_hours
                WHERE tenant_id = ?
                ORDER BY day_of_week ASC
                `,
                [staff.tenant.id]
            );

            res.json({
                working_hours: rows
            });
        } catch (err) {
            console.error('GET TENANT WORKING HOURS ERROR:', err);

            res.status(500).json({
                message: 'Greška pri učitavanju radnog vremena lokala',
                code: 'GET_TENANT_WORKING_HOURS_FAILED'
            });
        }
    }
);

tenantAdminRouter.put(
    '/working-hours',
    requireTenantRole(['owner']),
    async (req: Request, res: Response) => {
        const conn = await db.getConnection();

        try {
            const staff = (req as any).tenantStaff;

            const { days } = req.body as {
                days: {
                    day_of_week: number;
                    is_working: boolean;
                    start_time: string | null;
                    end_time: string | null;
                }[];
            };

            if (!Array.isArray(days) || days.length !== 7) {
                return res.status(400).json({
                    message: 'Moraš poslati svih 7 dana u nedelji',
                    code: 'INVALID_WORKING_DAYS'
                });
            }

            for (const day of days) {
                const dayOfWeek = Number(day.day_of_week);

                if (Number.isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
                    return res.status(400).json({
                        message: 'Dan u nedelji nije validan',
                        code: 'INVALID_DAY_OF_WEEK'
                    });
                }

                if (day.is_working) {
                    if (!day.start_time || !day.end_time) {
                        return res.status(400).json({
                            message: 'Za radni dan moraš uneti vreme od i do',
                            code: 'MISSING_WORKING_TIME'
                        });
                    }

                    if (day.start_time >= day.end_time) {
                        return res.status(400).json({
                            message: 'Početak radnog vremena mora biti pre kraja',
                            code: 'INVALID_WORKING_TIME'
                        });
                    }
                }
            }

            await conn.beginTransaction();

            for (const day of days) {
                const isWorking = Boolean(day.is_working);

                await conn.query(
                    `
                    INSERT INTO tenant_working_hours (
                        tenant_id,
                        day_of_week,
                        is_working,
                        start_time,
                        end_time
                    )
                    VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        is_working = VALUES(is_working),
                        start_time = VALUES(start_time),
                        end_time = VALUES(end_time)
                    `,
                    [
                        staff.tenant.id,
                        day.day_of_week,
                        isWorking,
                        isWorking ? day.start_time : null,
                        isWorking ? day.end_time : null
                    ]
                );
            }

            const [rows]: any = await conn.query(
                `
                SELECT
                    id,
                    tenant_id,
                    day_of_week,
                    is_working,
                    start_time,
                    end_time,
                    created_at,
                    updated_at
                FROM tenant_working_hours
                WHERE tenant_id = ?
                ORDER BY day_of_week ASC
                `,
                [staff.tenant.id]
            );

            await conn.commit();

            res.json({
                ok: true,
                message: 'Radno vreme lokala je uspešno izmenjeno',
                working_hours: rows
            });
        } catch (err) {
            await conn.rollback();

            console.error('UPDATE TENANT WORKING HOURS ERROR:', err);

            res.status(500).json({
                message: 'Greška pri izmeni radnog vremena lokala',
                code: 'UPDATE_TENANT_WORKING_HOURS_FAILED'
            });
        } finally {
            conn.release();
        }
    }
);

tenantAdminRouter.get(
    '/working-overrides',
    requireTenantRole(['owner']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;

            const [rows]: any = await db.query(
                `
                SELECT
                    id,
                    tenant_id,
                    start_date,
                    end_date,
                    is_closed,
                    start_time,
                    end_time,
                    note,
                    created_at,
                    updated_at
                FROM tenant_working_overrides
                WHERE tenant_id = ?
                ORDER BY start_date DESC, id DESC
                `,
                [staff.tenant.id]
            );

            res.json({
                overrides: rows
            });
        } catch (err) {
            console.error('GET TENANT WORKING OVERRIDES ERROR:', err);

            res.status(500).json({
                message: 'Greška pri učitavanju posebnih dana',
                code: 'GET_TENANT_WORKING_OVERRIDES_FAILED'
            });
        }
    }
);

tenantAdminRouter.post(
    '/working-overrides',
    requireTenantRole(['owner']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;

            const {
                date,
                is_closed,
                start_time,
                end_time,
                note
            } = req.body as {
                date: string;
                is_closed: boolean;
                start_time?: string | null;
                end_time?: string | null;
                note?: string | null;
            };

            if (!date) {
                return res.status(400).json({
                    message: 'Datum je obavezan',
                    code: 'MISSING_OVERRIDE_DATE'
                });
            }

            const isClosed = Boolean(is_closed);

            if (!isClosed) {
                if (!start_time || !end_time) {
                    return res.status(400).json({
                        message: 'Za izmenjeno radno vreme moraš uneti vreme od i do',
                        code: 'MISSING_OVERRIDE_TIME'
                    });
                }

                if (start_time >= end_time) {
                    return res.status(400).json({
                        message: 'Početak radnog vremena mora biti pre kraja',
                        code: 'INVALID_OVERRIDE_TIME'
                    });
                }
            }

            const [result]: any = await db.query(
                `
                INSERT INTO tenant_working_overrides (
                    tenant_id,
                    start_date,
                    end_date,
                    is_closed,
                    start_time,
                    end_time,
                    note
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    staff.tenant.id,
                    date,
                    date,
                    isClosed,
                    isClosed ? null : start_time,
                    isClosed ? null : end_time,
                    note?.trim() || null
                ]
            );

            const [rows]: any = await db.query(
                `
                SELECT
                    id,
                    tenant_id,
                    start_date,
                    end_date,
                    is_closed,
                    start_time,
                    end_time,
                    note,
                    created_at,
                    updated_at
                FROM tenant_working_overrides
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [result.insertId, staff.tenant.id]
            );

            res.status(201).json({
                ok: true,
                message: isClosed
                    ? 'Neradan dan je uspešno dodat'
                    : 'Posebno radno vreme je uspešno dodato',
                override: rows[0]
            });
        } catch (err) {
            console.error('CREATE TENANT WORKING OVERRIDE ERROR:', err);

            res.status(500).json({
                message: 'Greška pri dodavanju posebnog dana',
                code: 'CREATE_TENANT_WORKING_OVERRIDE_FAILED'
            });
        }
    }
);

tenantAdminRouter.delete(
    '/working-overrides/:overrideId',
    requireTenantRole(['owner']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;
            const overrideId = Number(req.params.overrideId);

            if (!overrideId) {
                return res.status(400).json({
                    message: 'Nedostaje ID posebnog dana',
                    code: 'MISSING_OVERRIDE_ID'
                });
            }

            const [existing]: any = await db.query(
                `
                SELECT id
                FROM tenant_working_overrides
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [overrideId, staff.tenant.id]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    message: 'Poseban dan nije pronađen',
                    code: 'OVERRIDE_NOT_FOUND'
                });
            }

            await db.query(
                `
                DELETE FROM tenant_working_overrides
                WHERE id = ?
                  AND tenant_id = ?
                `,
                [overrideId, staff.tenant.id]
            );

            res.json({
                ok: true,
                message: 'Poseban dan je uklonjen'
            });
        } catch (err) {
            console.error('DELETE TENANT WORKING OVERRIDE ERROR:', err);

            res.status(500).json({
                message: 'Greška pri brisanju posebnog dana',
                code: 'DELETE_TENANT_WORKING_OVERRIDE_FAILED'
            });
        }
    }
);

///////////// KRAJ RADNO VREME /////////////



///////////// RADNO VREME FRIZERA ////////////////

//Helper
function formatDateBackend(value: string) {
    const dateOnly = getDateOnly(value);
    const [year, month, day] = dateOnly.split('-').map(Number);

    if (!year || !month || !day) {
        return dateOnly;
    }

    return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}.`;
}

function dayNameBackend(day: number) {
    const names: Record<number, string> = {
        0: 'Nedelja',
        1: 'Ponedeljak',
        2: 'Utorak',
        3: 'Sreda',
        4: 'Četvrtak',
        5: 'Petak',
        6: 'Subota'
    };

    return names[day] || 'Dan';
}

function normalizeBackendTime(value: string | null | undefined) {
    if (!value) return null;

    const clean = String(value).slice(0, 8);

    return clean.length === 5 ? `${clean}:00` : clean;
}

function getDateOnly(value: string) {
    return String(value).slice(0, 10);
}

async function getTenantWorkingWindowForDay(
    tenantId: number,
    date: string,
    fallbackDayOfWeek: number
) {
    const dateOnly = getDateOnly(date);

    const [overrideRows]: any = await db.query(
        `
        SELECT
            id,
            is_closed,
            start_time,
            end_time
        FROM tenant_working_overrides
        WHERE tenant_id = ?
          AND start_date <= ?
          AND end_date >= ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [tenantId, dateOnly, dateOnly]
    );

    if (overrideRows.length > 0) {
        const override = overrideRows[0];

        return {
            is_working: !Boolean(override.is_closed),
            start_time: normalizeBackendTime(override.start_time),
            end_time: normalizeBackendTime(override.end_time),
            source: 'override'
        };
    }

    const [weeklyRows]: any = await db.query(
        `
        SELECT
            is_working,
            start_time,
            end_time
        FROM tenant_working_hours
        WHERE tenant_id = ?
          AND day_of_week = ?
        LIMIT 1
        `,
        [tenantId, fallbackDayOfWeek]
    );

    if (weeklyRows.length === 0) {
        return {
            is_working: false,
            start_time: null,
            end_time: null,
            source: 'missing'
        };
    }

    const weekly = weeklyRows[0];

    return {
        is_working: Boolean(weekly.is_working),
        start_time: normalizeBackendTime(weekly.start_time),
        end_time: normalizeBackendTime(weekly.end_time),
        source: 'weekly'
    };
}

async function getTenantWeeklyHoursMap(tenantId: number) {
    const [tenantWorkingRows]: any = await db.query(
        `
        SELECT
            day_of_week,
            is_working,
            start_time,
            end_time
        FROM tenant_working_hours
        WHERE tenant_id = ?
        `,
        [tenantId]
    );

    const map = new Map<number, {
        is_working: boolean;
        start_time: string | null;
        end_time: string | null;
    }>();

    for (const row of tenantWorkingRows) {
        map.set(Number(row.day_of_week), {
            is_working: Boolean(row.is_working),
            start_time: normalizeBackendTime(row.start_time),
            end_time: normalizeBackendTime(row.end_time)
        });
    }

    return map;
}
//Kraj helper

tenantAdminRouter.get(
    '/barber-working-hours',
    requireTenantRole(['owner', 'admin', 'barber']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;
            const requestedBarberId = Number(req.query.barber_id || 0);

            let selectedBarberId: number | null = null;
            let canSelectBarber = false;

            const isOwnerOrAdmin = staff.role === 'owner' || staff.role === 'admin';
            const isBarber = staff.role === 'barber';

            let barbers: any[] = [];

            if (isOwnerOrAdmin) {
                canSelectBarber = true;

                const [barberRows]: any = await db.query(
                    `
                    SELECT
                        id,
                        tenant_id,
                        user_id,
                        name,
                        phone,
                        email,
                        specialty,
                        is_active
                    FROM barbers
                    WHERE tenant_id = ?
                    ORDER BY is_active DESC, name ASC, id ASC
                    `,
                    [staff.tenant.id]
                );

                barbers = barberRows;

                if (requestedBarberId) {
                    const exists = barbers.some((barber) => barber.id === requestedBarberId);

                    if (!exists) {
                        return res.status(404).json({
                            message: 'Frizer nije pronađen u ovom lokalu',
                            code: 'BARBER_NOT_FOUND'
                        });
                    }

                    selectedBarberId = requestedBarberId;
                } else {
                    selectedBarberId = barbers[0]?.id ?? null;
                }
            }

            if (isBarber) {
                canSelectBarber = false;

                const [barberRows]: any = await db.query(
                    `
                    SELECT
                        id,
                        tenant_id,
                        user_id,
                        name,
                        phone,
                        email,
                        specialty,
                        is_active
                    FROM barbers
                    WHERE tenant_id = ?
                      AND user_id = ?
                      AND is_active = TRUE
                    LIMIT 1
                    `,
                    [staff.tenant.id, staff.user.id]
                );

                if (barberRows.length === 0) {
                    return res.status(403).json({
                        message: 'Tvoj nalog nije povezan sa frizerom u ovom lokalu',
                        code: 'BARBER_PROFILE_NOT_LINKED'
                    });
                }

                barbers = barberRows;
                selectedBarberId = barberRows[0].id;
            }

            if (!selectedBarberId) {
                return res.status(404).json({
                    message: 'Nema frizera za prikaz',
                    code: 'NO_BARBERS_FOUND'
                });
            }

            const selectedBarber = barbers.find((barber) => barber.id === selectedBarberId) || null;

            const [settingsRows]: any = await db.query(
                `
                SELECT
                    id,
                    barber_id,
                    work_mode,
                    rotation_starts_at,
                    is_active,
                    created_at,
                    updated_at
                FROM barber_shift_settings
                WHERE barber_id = ?
                LIMIT 1
                `,
                [selectedBarberId]
            );

            const [workingHoursRows]: any = await db.query(
                `
                SELECT
                    id,
                    barber_id,
                    shift_number,
                    day_of_week,
                    is_working,
                    start_time,
                    end_time,
                    created_at,
                    updated_at
                FROM barber_shift_working_hours
                WHERE barber_id = ?
                ORDER BY shift_number ASC, day_of_week ASC
                `,
                [selectedBarberId]
            );

            const [overrideRows]: any = await db.query(
                `
                SELECT
                    id,
                    barber_id,
                    start_date,
                    end_date,
                    is_closed,
                    start_time,
                    end_time,
                    created_at,
                    updated_at
                FROM barber_working_overrides
                WHERE barber_id = ?
                ORDER BY start_date DESC, id DESC
                `,
                [selectedBarberId]
            );

            res.json({
                staff_role: staff.role,
                can_select_barber: canSelectBarber,
                selected_barber: selectedBarber,
                barbers,
                settings: settingsRows[0] || null,
                working_hours: workingHoursRows,
                overrides: overrideRows
            });
        } catch (err) {
            console.error('GET BARBER WORKING HOURS ERROR:', err);

            res.status(500).json({
                message: 'Greška pri učitavanju radnog vremena frizera',
                code: 'GET_BARBER_WORKING_HOURS_FAILED'
            });
        }
    }
);

tenantAdminRouter.put(
    '/barber-working-hours/:barberId',
    requireTenantRole(['owner', 'admin', 'barber']),
    async (req: Request, res: Response) => {
        const conn = await db.getConnection();

        try {
            const staff = (req as any).tenantStaff;
            const barberId = Number(req.params.barberId);

            const {
                work_mode,
                rotation_starts_at,
                shifts
            } = req.body as {
                work_mode: 'single_shift' | 'alternating_shifts';
                rotation_starts_at?: string | null;
                shifts: {
                    shift_number: number;
                    days: {
                        day_of_week: number;
                        is_working: boolean;
                        start_time: string | null;
                        end_time: string | null;
                    }[];
                }[];
            };

            if (!barberId) {
                return res.status(400).json({
                    message: 'Nedostaje ID frizera',
                    code: 'MISSING_BARBER_ID'
                });
            }

            if (!['single_shift', 'alternating_shifts'].includes(work_mode)) {
                return res.status(400).json({
                    message: 'Tip radnog vremena nije validan',
                    code: 'INVALID_WORK_MODE'
                });
            }

            if (work_mode === 'alternating_shifts' && !rotation_starts_at) {
                return res.status(400).json({
                    message: 'Za smenski rad moraš uneti datum početka rotacije',
                    code: 'MISSING_ROTATION_START'
                });
            }

            if (!Array.isArray(shifts)) {
                return res.status(400).json({
                    message: 'Smene nisu validne',
                    code: 'INVALID_SHIFTS'
                });
            }

            const tenantWeeklyHoursByDay = await getTenantWeeklyHoursMap(staff.tenant.id);

            const requiredShiftNumbers = work_mode === 'single_shift' ? [1] : [1, 2];

            for (const shiftNumber of requiredShiftNumbers) {
                const shift = shifts.find((item) => Number(item.shift_number) === shiftNumber);

                if (!shift || !Array.isArray(shift.days) || shift.days.length !== 7) {
                    return res.status(400).json({
                        message: `Moraš poslati svih 7 dana za smenu ${shiftNumber}`,
                        code: 'INVALID_SHIFT_DAYS'
                    });
                }

                for (const day of shift.days) {
                    const dayOfWeek = Number(day.day_of_week);

                    if (Number.isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
                        return res.status(400).json({
                            message: 'Dan u nedelji nije validan',
                            code: 'INVALID_DAY_OF_WEEK'
                        });
                    }

                    if (day.is_working) {
                        if (!day.start_time || !day.end_time) {
                            return res.status(400).json({
                                message: `Za radni dan u smeni ${shiftNumber} moraš uneti vreme od i do`,
                                code: 'MISSING_WORKING_TIME'
                            });
                        }

                        const barberStart = normalizeBackendTime(day.start_time);
                        const barberEnd = normalizeBackendTime(day.end_time);

                        if (!barberStart || !barberEnd || barberStart >= barberEnd) {
                            return res.status(400).json({
                                message: `Početak mora biti pre kraja u smeni ${shiftNumber}`,
                                code: 'INVALID_WORKING_TIME'
                            });
                        }

                        const tenantDay = tenantWeeklyHoursByDay.get(dayOfWeek);

                        if (!tenantDay || !tenantDay.is_working) {
                            return res.status(400).json({
                                message: `${dayNameBackend(dayOfWeek)} je neradan dan za lokal. Frizer ne može raditi tog dana.`,
                                code: 'BARBER_HOURS_OUTSIDE_TENANT_HOURS'
                            });
                        }

                        const tenantStart = tenantDay.start_time;
                        const tenantEnd = tenantDay.end_time;

                        if (!tenantStart || !tenantEnd) {
                            return res.status(400).json({
                                message: `${dayNameBackend(dayOfWeek)} nema podešeno radno vreme lokala.`,
                                code: 'TENANT_WORKING_HOURS_NOT_SET'
                            });
                        }

                        if (barberStart < tenantStart || barberEnd > tenantEnd) {
                            return res.status(400).json({
                                message: `${dayNameBackend(dayOfWeek)}: radno vreme frizera mora biti unutar radnog vremena lokala (${tenantStart.slice(0, 5)} - ${tenantEnd.slice(0, 5)}).`,
                                code: 'BARBER_HOURS_OUTSIDE_TENANT_HOURS'
                            });
                        }

                        day.start_time = barberStart;
                        day.end_time = barberEnd;
                    }
                }
            }

            await conn.beginTransaction();

            const [barberRows]: any = await conn.query(
                `
                SELECT id, tenant_id, user_id
                FROM barbers
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                FOR UPDATE
                `,
                [barberId, staff.tenant.id]
            );

            if (barberRows.length === 0) {
                await conn.rollback();

                return res.status(404).json({
                    message: 'Frizer nije pronađen u ovom lokalu',
                    code: 'BARBER_NOT_FOUND'
                });
            }

            const barber = barberRows[0];

            if (staff.role === 'barber' && barber.user_id !== staff.user.id) {
                await conn.rollback();

                return res.status(403).json({
                    message: 'Možeš menjati samo svoje radno vreme',
                    code: 'BARBER_CAN_EDIT_ONLY_OWN_HOURS'
                });
            }

            await conn.query(
                `
                INSERT INTO barber_shift_settings (
                    barber_id,
                    work_mode,
                    rotation_starts_at,
                    is_active
                )
                VALUES (?, ?, ?, TRUE)
                ON DUPLICATE KEY UPDATE
                    work_mode = VALUES(work_mode),
                    rotation_starts_at = VALUES(rotation_starts_at)
                `,
                [
                    barberId,
                    work_mode,
                    work_mode === 'alternating_shifts' ? rotation_starts_at : null
                ]
            );

            for (const shiftNumber of requiredShiftNumbers) {
                const shift = shifts.find((item) => Number(item.shift_number) === shiftNumber)!;

                for (const day of shift.days) {
                    const isWorking = Boolean(day.is_working);

                    await conn.query(
                        `
                        INSERT INTO barber_shift_working_hours (
                            barber_id,
                            shift_number,
                            day_of_week,
                            is_working,
                            start_time,
                            end_time
                        )
                        VALUES (?, ?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                            is_working = VALUES(is_working),
                            start_time = VALUES(start_time),
                            end_time = VALUES(end_time)
                        `,
                        [
                            barberId,
                            shiftNumber,
                            day.day_of_week,
                            isWorking,
                            isWorking ? day.start_time : null,
                            isWorking ? day.end_time : null
                        ]
                    );
                }
            }

            if (work_mode === 'single_shift') {
                await conn.query(
                    `
                    DELETE FROM barber_shift_working_hours
                    WHERE barber_id = ?
                      AND shift_number = 2
                    `,
                    [barberId]
                );
            }

            const [settingsRows]: any = await conn.query(
                `
                SELECT
                    id,
                    barber_id,
                    work_mode,
                    rotation_starts_at,
                    is_active,
                    created_at,
                    updated_at
                FROM barber_shift_settings
                WHERE barber_id = ?
                LIMIT 1
                `,
                [barberId]
            );

            const [workingHoursRows]: any = await conn.query(
                `
                SELECT
                    id,
                    barber_id,
                    shift_number,
                    day_of_week,
                    is_working,
                    start_time,
                    end_time,
                    created_at,
                    updated_at
                FROM barber_shift_working_hours
                WHERE barber_id = ?
                ORDER BY shift_number ASC, day_of_week ASC
                `,
                [barberId]
            );

            await conn.commit();

            res.json({
                ok: true,
                message: 'Radno vreme frizera je uspešno izmenjeno',
                settings: settingsRows[0],
                working_hours: workingHoursRows
            });
        } catch (err) {
            await conn.rollback();

            console.error('UPDATE BARBER WORKING HOURS ERROR:', err);

            res.status(500).json({
                message: 'Greška pri izmeni radnog vremena frizera',
                code: 'UPDATE_BARBER_WORKING_HOURS_FAILED'
            });
        } finally {
            conn.release();
        }
    }
);

tenantAdminRouter.get(
    '/barber-working-overrides/:barberId',
    requireTenantRole(['owner', 'admin', 'barber']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;
            const barberId = Number(req.params.barberId);

            if (!barberId) {
                return res.status(400).json({
                    message: 'Nedostaje ID frizera',
                    code: 'MISSING_BARBER_ID'
                });
            }

            const [barberRows]: any = await db.query(
                `
                SELECT id, tenant_id, user_id
                FROM barbers
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [barberId, staff.tenant.id]
            );

            if (barberRows.length === 0) {
                return res.status(404).json({
                    message: 'Frizer nije pronađen u ovom lokalu',
                    code: 'BARBER_NOT_FOUND'
                });
            }

            const barber = barberRows[0];

            if (staff.role === 'barber' && barber.user_id !== staff.user.id) {
                return res.status(403).json({
                    message: 'Možeš videti samo svoje posebne dane',
                    code: 'BARBER_CAN_VIEW_ONLY_OWN_OVERRIDES'
                });
            }

            const [rows]: any = await db.query(
                `
                SELECT
                    id,
                    barber_id,
                    start_date,
                    end_date,
                    is_closed,
                    start_time,
                    end_time,
                    created_at,
                    updated_at
                FROM barber_working_overrides
                WHERE barber_id = ?
                ORDER BY start_date DESC, id DESC
                `,
                [barberId]
            );

            res.json({
                overrides: rows
            });
        } catch (err) {
            console.error('GET BARBER WORKING OVERRIDES ERROR:', err);

            res.status(500).json({
                message: 'Greška pri učitavanju posebnih dana frizera',
                code: 'GET_BARBER_WORKING_OVERRIDES_FAILED'
            });
        }
    }
);

tenantAdminRouter.post(
    '/barber-working-overrides/:barberId',
    requireTenantRole(['owner', 'admin', 'barber']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;
            const barberId = Number(req.params.barberId);

            const {
                date,
                is_closed,
                start_time,
                end_time
            } = req.body as {
                date: string;
                is_closed: boolean;
                start_time?: string | null;
                end_time?: string | null;
            };

            if (!barberId) {
                return res.status(400).json({
                    message: 'Nedostaje ID frizera',
                    code: 'MISSING_BARBER_ID'
                });
            }

            if (!date) {
                return res.status(400).json({
                    message: 'Datum je obavezan',
                    code: 'MISSING_OVERRIDE_DATE'
                });
            }

            const dateOnly = getDateOnly(date);
            const selectedDate = new Date(`${dateOnly}T12:00:00`);
            const dayOfWeek = selectedDate.getDay();

            if (Number.isNaN(selectedDate.getTime())) {
                return res.status(400).json({
                    message: 'Datum nije validan',
                    code: 'INVALID_OVERRIDE_DATE'
                });
            }

            const isClosed = Boolean(is_closed);

            if (!isClosed) {
                if (!start_time || !end_time) {
                    return res.status(400).json({
                        message: 'Za izmenjeno radno vreme moraš uneti vreme od i do',
                        code: 'MISSING_OVERRIDE_TIME'
                    });
                }

                const barberStart = normalizeBackendTime(start_time);
                const barberEnd = normalizeBackendTime(end_time);

                if (!barberStart || !barberEnd || barberStart >= barberEnd) {
                    return res.status(400).json({
                        message: 'Početak radnog vremena mora biti pre kraja',
                        code: 'INVALID_OVERRIDE_TIME'
                    });
                }

                const tenantWindow = await getTenantWorkingWindowForDay(
                    staff.tenant.id,
                    dateOnly,
                    dayOfWeek
                );

                if (!tenantWindow.is_working) {
                    return res.status(400).json({
                        message: `${formatDateBackend(dateOnly)} je neradan dan za lokal. Frizer ne može raditi tog dana.`,
                        code: 'BARBER_OVERRIDE_OUTSIDE_TENANT_HOURS'
                    });
                }

                if (!tenantWindow.start_time || !tenantWindow.end_time) {
                    return res.status(400).json({
                        message: `Lokal nema podešeno radno vreme za ${formatDateBackend(dateOnly)}.`,
                        code: 'TENANT_WORKING_HOURS_NOT_SET'
                    });
                }

                if (barberStart < tenantWindow.start_time || barberEnd > tenantWindow.end_time) {
                    return res.status(400).json({
                        message: `Radno vreme frizera mora biti unutar radnog vremena lokala (${tenantWindow.start_time.slice(0, 5)} - ${tenantWindow.end_time.slice(0, 5)}).`,
                        code: 'BARBER_OVERRIDE_OUTSIDE_TENANT_HOURS'
                    });
                }
            }

            const [barberRows]: any = await db.query(
                `
                SELECT id, tenant_id, user_id
                FROM barbers
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [barberId, staff.tenant.id]
            );

            if (barberRows.length === 0) {
                return res.status(404).json({
                    message: 'Frizer nije pronađen u ovom lokalu',
                    code: 'BARBER_NOT_FOUND'
                });
            }

            const barber = barberRows[0];

            if (staff.role === 'barber' && barber.user_id !== staff.user.id) {
                return res.status(403).json({
                    message: 'Možeš menjati samo svoje posebne dane',
                    code: 'BARBER_CAN_EDIT_ONLY_OWN_OVERRIDES'
                });
            }

            await db.query(
                `
                DELETE FROM barber_working_overrides
                WHERE barber_id = ?
                  AND start_date = ?
                  AND end_date = ?
                `,
                [barberId, dateOnly, dateOnly]
            );

            const [result]: any = await db.query(
                `
                INSERT INTO barber_working_overrides (
                    barber_id,
                    start_date,
                    end_date,
                    is_closed,
                    start_time,
                    end_time
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    barberId,
                    dateOnly,
                    dateOnly,
                    isClosed,
                    isClosed ? null : normalizeBackendTime(start_time),
                    isClosed ? null : normalizeBackendTime(end_time)
                ]
            );

            const [rows]: any = await db.query(
                `
                SELECT
                    id,
                    barber_id,
                    start_date,
                    end_date,
                    is_closed,
                    start_time,
                    end_time,
                    created_at,
                    updated_at
                FROM barber_working_overrides
                WHERE id = ?
                  AND barber_id = ?
                LIMIT 1
                `,
                [result.insertId, barberId]
            );

            res.status(201).json({
                ok: true,
                message: isClosed
                    ? 'Neradan dan frizera je uspešno dodat'
                    : 'Posebno radno vreme frizera je uspešno dodato',
                override: rows[0]
            });
        } catch (err) {
            console.error('CREATE BARBER WORKING OVERRIDE ERROR:', err);

            res.status(500).json({
                message: 'Greška pri dodavanju posebnog dana frizera',
                code: 'CREATE_BARBER_WORKING_OVERRIDE_FAILED'
            });
        }
    }
);

tenantAdminRouter.delete(
    '/barber-working-overrides/:barberId/:overrideId',
    requireTenantRole(['owner', 'admin', 'barber']),
    async (req: Request, res: Response) => {
        try {
            const staff = (req as any).tenantStaff;
            const barberId = Number(req.params.barberId);
            const overrideId = Number(req.params.overrideId);

            if (!barberId || !overrideId) {
                return res.status(400).json({
                    message: 'Nedostaje ID frizera ili posebnog dana',
                    code: 'MISSING_OVERRIDE_ID'
                });
            }

            const [barberRows]: any = await db.query(
                `
                SELECT id, tenant_id, user_id
                FROM barbers
                WHERE id = ?
                  AND tenant_id = ?
                LIMIT 1
                `,
                [barberId, staff.tenant.id]
            );

            if (barberRows.length === 0) {
                return res.status(404).json({
                    message: 'Frizer nije pronađen u ovom lokalu',
                    code: 'BARBER_NOT_FOUND'
                });
            }

            const barber = barberRows[0];

            if (staff.role === 'barber' && barber.user_id !== staff.user.id) {
                return res.status(403).json({
                    message: 'Možeš brisati samo svoje posebne dane',
                    code: 'BARBER_CAN_DELETE_ONLY_OWN_OVERRIDES'
                });
            }

            const [existing]: any = await db.query(
                `
                SELECT id
                FROM barber_working_overrides
                WHERE id = ?
                  AND barber_id = ?
                LIMIT 1
                `,
                [overrideId, barberId]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    message: 'Poseban dan nije pronađen',
                    code: 'OVERRIDE_NOT_FOUND'
                });
            }

            await db.query(
                `
                DELETE FROM barber_working_overrides
                WHERE id = ?
                  AND barber_id = ?
                `,
                [overrideId, barberId]
            );

            res.json({
                ok: true,
                message: 'Poseban dan frizera je uklonjen'
            });
        } catch (err) {
            console.error('DELETE BARBER WORKING OVERRIDE ERROR:', err);

            res.status(500).json({
                message: 'Greška pri brisanju posebnog dana frizera',
                code: 'DELETE_BARBER_WORKING_OVERRIDE_FAILED'
            });
        }
    }
);


////////////// KRAJ RADNO VREME FRIZERA

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
