import type { Connection } from 'mysql2/promise';



type Slot = {
    start_time: string;
    end_time: string;
};

type BusyInterval = {
    start_time: string | Date;
    end_time: string | Date;
};

type WorkHours = {
    is_working: boolean;
    start_time: string | null;
    end_time: string | null;
};

type BreakInterval = {
    start_time: string;
    end_time: string;
};

const SLOT_MINUTES = 30;


///Helper funkcije

function doesBreakApplyToDate(breakItem: any, date: string) {
    if (!normalizeBool(breakItem.is_active)) return false;

    if (breakItem.repeat_type === 'none') {
        return breakItem.break_date === date;
    }

    if (breakItem.repeat_type === 'weekly') {
        if (!breakItem.day_of_week && breakItem.day_of_week !== 0) return false;

        if (date < breakItem.break_date) return false;

        if (breakItem.repeat_until && date > breakItem.repeat_until) {
            return false;
        }

        return getDayOfWeek(date) === breakItem.day_of_week;
    }

    return false;
}

function localDateTime(date: string, hhmm: string) {
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = hhmm.split(':').map(Number);

    return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function toSqlDateTime(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${y}-${m}-${d} ${h}:${min}:00`;
}

function parseDbDateTime(value: string | Date): Date {
    if (value instanceof Date) {
        return value;
    }

    return new Date(value.replace(" ", "T"));
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    return aStart < bEnd && aEnd > bStart;
}

function getDayOfWeek(date: string) {
    return new Date(`${date}T00:00:00`).getDay();
}

function normalizeBool(value: number | boolean) {
    return value === true || value === 1;
}

function getMonday(date: string) {
    const d = new Date(`${date}T00:00:00`);
    const day = d.getDay(); // 0 nedelja, 1 ponedeljak...
    const diff = day === 0 ? -6 : 1 - day;

    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);

    return d;
}

function weeksBetween(from: Date, to: Date) {
    return Math.floor(
        (to.getTime() - from.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
}

async function getActiveShiftNumber(
    db: Connection,
    barberId: number,
    date: string
): Promise<1 | 2> {
    const [rows]: any = await db.query(
        `
    SELECT work_mode, rotation_starts_at, is_active
    FROM barber_shift_settings
    WHERE barber_id = ?
    LIMIT 1
    `,
        [barberId]
    );

    if (rows.length === 0 || !normalizeBool(rows[0].is_active)) {
        return 1;
    }

    const settings = rows[0];

    if (settings.work_mode === 'single_shift') {
        return 1;
    }

    if (!settings.rotation_starts_at) {
        return 1;
    }

    const startDate = String(settings.rotation_starts_at).slice(0, 10);

    const startMonday = getMonday(startDate);
    const targetMonday = getMonday(date);

    const diffWeeks = weeksBetween(startMonday, targetMonday);

    return diffWeeks % 2 === 0 ? 1 : 2;
}

async function getBarberShiftHoursForDate(
    db: Connection,
    barberId: number,
    date: string
): Promise<WorkHours> {
    const override = await getBarberOverrideForDate(db, barberId, date);

    if (override) {
        return override;
    }

    const shiftNumber = await getActiveShiftNumber(db, barberId, date);
    const dayOfWeek = getDayOfWeek(date);

    const [rows]: any = await db.query(
        `
    SELECT is_working, start_time, end_time
    FROM barber_shift_working_hours
    WHERE barber_id = ?
      AND shift_number = ?
      AND day_of_week = ?
    LIMIT 1
    `,
        [barberId, shiftNumber, dayOfWeek]
    );

    if (rows.length === 0 || !normalizeBool(rows[0].is_working)) {
        return {
            is_working: false,
            start_time: null,
            end_time: null,
        };
    }

    return {
        is_working: true,
        start_time: rows[0].start_time,
        end_time: rows[0].end_time,
    };
}

async function getTenantWorkingHoursForDate(
    db: Connection,
    tenantId: number,
    date: string
): Promise<WorkHours> {
    const override = await getTenantOverrideForDate(db, tenantId, date);

    if (override) {
        return override;
    }

    const dayOfWeek = getDayOfWeek(date);

    const [rows]: any = await db.query(
        `
    SELECT is_working, start_time, end_time
    FROM tenant_working_hours
    WHERE tenant_id = ?
      AND day_of_week = ?
    LIMIT 1
    `,
        [tenantId, dayOfWeek]
    );

    if (rows.length === 0 || !normalizeBool(rows[0].is_working)) {
        return {
            is_working: false,
            start_time: null,
            end_time: null,
        };
    }

    return {
        is_working: true,
        start_time: rows[0].start_time,
        end_time: rows[0].end_time,
    };
}

async function getBusyIntervals(
    db: Connection,
    barberId: number,
    date: string
): Promise<BusyInterval[]> {
    const startOfDay = `${date} 00:00:00`;
    const next = new Date(`${date}T00:00:00`);
    next.setDate(next.getDate() + 1);

    const nextDay = toSqlDateTime(next);

    const [rows]: any = await db.query(
        `
    SELECT start_time, end_time
    FROM appointments
    WHERE barber_id = ?
      AND start_time >= ?
      AND start_time < ?
    ORDER BY start_time ASC
    `,
        [barberId, startOfDay, nextDay]
    );

    return rows;
}

function timeToMinutes(time: string) {
    const [hours, minutes] = time.slice(0, 5).split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToHHMM(totalMinutes: number) {
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const minutes = String(totalMinutes % 60).padStart(2, '0');

    return `${hours}:${minutes}`;
}

async function getTenantOverrideForDate(
    db: Connection,
    tenantId: number,
    date: string
): Promise<WorkHours | null> {
    const [rows]: any = await db.query(
        `
    SELECT is_closed, start_time, end_time
    FROM tenant_working_overrides
    WHERE tenant_id = ?
      AND ? BETWEEN start_date AND end_date
    ORDER BY start_date DESC, id DESC
    LIMIT 1
    `,
        [tenantId, date]
    );

    if (rows.length === 0) {
        return null;
    }

    const override = rows[0];

    if (normalizeBool(override.is_closed)) {
        return {
            is_working: false,
            start_time: null,
            end_time: null,
        };
    }

    return {
        is_working: true,
        start_time: override.start_time,
        end_time: override.end_time,
    };
}

async function getBarberOverrideForDate(
    db: Connection,
    barberId: number,
    date: string
): Promise<WorkHours | null> {
    const [rows]: any = await db.query(
        `
        SELECT is_closed, start_time, end_time
        FROM barber_working_overrides
        WHERE barber_id = ?
          AND ? BETWEEN start_date AND end_date
        ORDER BY start_date DESC, id DESC
        LIMIT 1
        `,
        [barberId, date]
    );

    if (rows.length === 0) {
        return null;
    }

    const override = rows[0];

    if (normalizeBool(override.is_closed)) {
        return {
            is_working: false,
            start_time: null,
            end_time: null,
        };
    }

    return {
        is_working: true,
        start_time: override.start_time,
        end_time: override.end_time,
    };
}

async function getBreakIntervalsForDate(
    db: Connection,
    barberId: number,
    date: string
): Promise<BreakInterval[]> {
    const [rows]: any = await db.query(
        `
        SELECT *
        FROM barber_breaks
        WHERE barber_id = ?
          AND is_active = 1
        ORDER BY start_time ASC
        `,
        [barberId]
    );

    return rows
        .filter((item: any) => doesBreakApplyToDate(item, date))
        .map((item: any) => ({
            start_time: item.start_time,
            end_time: item.end_time,
        }));
}

function todayIso() {
    const now = new Date();

    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
}

export async function generateAvailableSlots(
    db: Connection,
    tenantId: number,
    barberId: number,
    date: string
): Promise<Slot[]> {
    const tenantHours = await getTenantWorkingHoursForDate(db, tenantId, date);
    const barberHours = await getBarberShiftHoursForDate(db, barberId, date);

    if (date <= todayIso()) {
        return [];
    }

    if (
        !tenantHours.is_working ||
        !barberHours.is_working ||
        !tenantHours.start_time ||
        !tenantHours.end_time ||
        !barberHours.start_time ||
        !barberHours.end_time
    ) {
        return [];
    }

    const tenantStart = timeToMinutes(tenantHours.start_time);
    const tenantEnd = timeToMinutes(tenantHours.end_time);

    const barberStart = timeToMinutes(barberHours.start_time);
    const barberEnd = timeToMinutes(barberHours.end_time);

    const finalStart = Math.max(tenantStart, barberStart);
    const finalEnd = Math.min(tenantEnd, barberEnd);

    if (finalStart >= finalEnd) {
        return [];
    }

    const start = localDateTime(date, minutesToHHMM(finalStart));
    const end = localDateTime(date, minutesToHHMM(finalEnd));

    const busyIntervals = await getBusyIntervals(db, barberId, date);

    const busyParsed = busyIntervals.map((interval) => ({
        start: parseDbDateTime(interval.start_time),
        end: parseDbDateTime(interval.end_time),
    }));

    const breaks = await getBreakIntervalsForDate(db, barberId, date);

    const breakParsed = breaks.map((item) => ({
        start: localDateTime(date, item.start_time.slice(0, 5)),
        end: localDateTime(date, item.end_time.slice(0, 5)),
    }));

    const slots: Slot[] = [];

    for (
        let current = new Date(start);
        current.getTime() + SLOT_MINUTES * 60_000 <= end.getTime();
        current = new Date(current.getTime() + SLOT_MINUTES * 60_000)
    ) {
        const slotEnd = new Date(current.getTime() + SLOT_MINUTES * 60_000);

        const isBusy = busyParsed.some((interval) =>
            overlaps(current, slotEnd, interval.start, interval.end)
        );

        if (isBusy) continue;

        const isOnBreak = breakParsed.some((item) =>
            overlaps(current, slotEnd, item.start, item.end)
        );

        if (isOnBreak) continue;

        slots.push({
            start_time: toSqlDateTime(current),
            end_time: toSqlDateTime(slotEnd),
        });
    }

    return slots;
}