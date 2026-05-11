import type { Connection } from "mysql2/promise";

export async function seedBarberShiftWorkingHours(db: Connection) {
    const [barberRows] = await db.query(`
        SELECT id
        FROM barbers
    `);

    const barbers = barberRows as { id: number }[];

    if (barbers.length === 0) {
        console.log("Nema frizera za seedovanje barber_shift_working_hours");
        return;
    }

    for (const barber of barbers) {
        await db.query(
            `
            INSERT INTO barber_shift_working_hours (
                barber_id,
                shift_number,
                day_of_week,
                is_working,
                start_time,
                end_time
            )
            VALUES
                (?, 1, 0, FALSE, NULL, NULL),
                (?, 1, 1, TRUE, '09:00:00', '17:00:00'),
                (?, 1, 2, TRUE, '09:00:00', '17:00:00'),
                (?, 1, 3, TRUE, '09:00:00', '17:00:00'),
                (?, 1, 4, TRUE, '09:00:00', '17:00:00'),
                (?, 1, 5, TRUE, '09:00:00', '17:00:00'),
                (?, 1, 6, FALSE, NULL, NULL)
            ON DUPLICATE KEY UPDATE
                is_working = VALUES(is_working),
                start_time = VALUES(start_time),
                end_time = VALUES(end_time)
            `,
            [
                barber.id,
                barber.id,
                barber.id,
                barber.id,
                barber.id,
                barber.id,
                barber.id,
            ]
        );
    }

    console.log("Uspesno seedovanje tabele barber_shift_working_hours");
}