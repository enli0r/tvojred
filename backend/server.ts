import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type { VerifiedRegistrationResponse, VerifiedAuthenticationResponse } from "@simplewebauthn/server";

import express from 'express';
import type { Request, Response } from 'express';
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
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // kasnije na HTTPS stavi true
    },
}));


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
                message: 'Moraš biti ulogovan da bi zakazao termin'
            });
        }

        if (!tenant_id || !barber_id || !start_time || !end_time) {
            return res.status(400).json({
                message: 'Nedostaju podaci za termin'
            });
        }

        await conn.beginTransaction();

        const [userRows]: any = await conn.query(
            `
            SELECT id, name, phone
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
                message: 'Korisnik nije pronađen'
            });
        }

        const user = userRows[0];

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
        } else {
            const [customerResult]: any = await conn.query(
                `
                INSERT INTO customers
                (tenant_id, user_id, name, phone)
                VALUES (?, ?, ?, ?)
                `,
                [tenant_id, user.id, user.name, user.phone]
            );

            customerId = customerResult.insertId;
        }

        const appointmentDate = String(start_time).slice(0, 10);

        const [dailyRows]: any = await conn.query(
            `
            SELECT a.id
            FROM appointments a
            INNER JOIN customers c ON c.id = a.customer_id
            WHERE a.tenant_id = ?
              AND c.user_id = ?
              AND DATE(a.start_time) = ?
            LIMIT 1
            FOR UPDATE
            `,
            [tenant_id, user.id, appointmentDate]
        );

        if (dailyRows.length > 0) {
            await conn.rollback();
            return res.status(409).json({
                message: 'Već imaš jedan zakazan termin za ovaj dan'
            });
        }

        const [existing]: any = await conn.query(
            `
            SELECT id
            FROM appointments
            WHERE barber_id = ?
              AND start_time < ?
              AND end_time > ?
            FOR UPDATE
            `,
            [barber_id, end_time, start_time]
        );

        if (existing.length > 0) {
            await conn.rollback();
            return res.status(409).json({
                message: 'Termin je već zauzet'
            });
        }

        const [result]: any = await conn.query(
            `
            INSERT INTO appointments
            (tenant_id, customer_id, barber_id, start_time, end_time)
            VALUES (?, ?, ?, ?, ?)
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
                message: 'Termin je već zauzet'
            });
        }

        console.error(err);

        res.status(500).json({
            message: 'Greška pri zakazivanju termina'
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

        // 1) nađi ili kreiraj user po telefonu
        const [urows] = await db.query("SELECT id FROM users WHERE phone = ?", [phone]);
        let userId = (urows as any[])[0]?.id as number | undefined;

        if (!userId) {
            const [ins] = await db.query("INSERT INTO users(name, phone) VALUES(?, ?)", [name, phone]);
            userId = (ins as any).insertId;
        }

        // 2) exclude postojeće credentiale (da ne pravi duplikat)
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
            userName: phone,
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
    } catch (err) {
        console.error(err);
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
        if (!phone) return res.status(400).json({ message: "Missing phone" });

        const [urows] = await db.query("SELECT id FROM users WHERE phone = ?", [phone]);
        const userId = (urows as any[])[0]?.id as number | undefined;
        if (!userId) return res.status(404).json({ message: "User not found" });

        const [crows] = await db.query(
            "SELECT credential_id, transports FROM webauthn_credentials WHERE user_id = ?",
            [userId]
        );

        const allowCredentials = (crows as any[]).map((c) => ({
            id: c.credential_id,
            type: "public-key" as const,
        }));

        const options = await generateAuthenticationOptions({
            rpID: process.env.RP_ID!,
            allowCredentials,
            userVerification: "preferred",
        });

        (req.session as any).webauthn = {
            challenge: options.challenge,
            userId,
            origin: process.env.ORIGIN!,
            rpID: process.env.RP_ID!,
        };

        res.json(options);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login options failed" });
    }
});

app.post("/auth/login/verify", async (req: Request, res: Response) => {
    try {
        const sess = (req.session as any).webauthn;
        if (!sess?.challenge || !sess?.userId) {
            return res.status(400).json({ message: "No challenge in session" });
        }

        const { challenge, userId, origin, rpID } = sess;

        const credentialId = req.body?.id;
        if (!credentialId) return res.status(400).json({ message: "Missing credential id" });

        const [crows] = await db.query(
            "SELECT id, credential_id, public_key, counter FROM webauthn_credentials WHERE user_id = ? AND credential_id = ?",
            [userId, credentialId]
        );
        const cred = (crows as any[])[0];
        if (!cred) return res.status(400).json({ message: "Credential not found" });

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
            return res.status(400).json({ message: "Not verified" });
        }

        await db.query("UPDATE webauthn_credentials SET counter = ? WHERE id = ?", [
            verification.authenticationInfo.newCounter,
            cred.id,
        ]);

        (req.session as any).userId = userId;
        delete (req.session as any).webauthn;

        res.json({ ok: true });
    } catch (err: any) {
        console.error("LOGIN VERIFY ERROR:", err);
        res.status(400).json({ message: "Login verification failed", error: err?.message ?? String(err) });
    }
});

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


app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
