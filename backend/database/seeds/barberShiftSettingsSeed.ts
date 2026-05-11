import type { Connection } from "mysql2/promise";

export async function seedBarberShiftSettings(db: Connection) {
    const [barberRows] = await db.query(`
        SELECT id
        FROM barbers
    `);

    const barbers = barberRows as { id: number }[];

    if (barbers.length === 0) {
        console.log("Nema frizera za seedovanje barber_shift_settings");
        return;
    }

    for (const barber of barbers) {
        await db.query(
            `
            INSERT INTO barber_shift_settings (
                barber_id,
                work_mode,
                rotation_starts_at,
                is_active
            )
            VALUES (?, 'single_shift', NULL, TRUE)
            ON DUPLICATE KEY UPDATE
                work_mode = VALUES(work_mode),
                rotation_starts_at = VALUES(rotation_starts_at),
                is_active = VALUES(is_active)
            `,
            [barber.id]
        );
    }

    console.log("Uspesno seedovanje tabele barber_shift_settings");
}