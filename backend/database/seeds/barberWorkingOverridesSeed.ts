import { Connection } from 'mysql2/promise';

export async function seedBarberWorkingOverrides(db: Connection) {
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM barber_working_overrides`);
    const count = (rows as any)[0].count;

    if (count === 0) {
        const [barbers]: any = await db.query(`
      SELECT id FROM barbers ORDER BY id ASC LIMIT 1
    `);

        if (barbers.length === 0) {
            console.log('Nema barbera');
            return;
        }

        const barberId = barbers[0].id;

        await db.query(
            `
      INSERT INTO barber_working_overrides
      (barber_id, start_date, end_date, is_closed, start_time, end_time)
      VALUES
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?)
      `,
            [
                // 🔹 ne radi jedan dan
                barberId,
                '2026-07-10',
                '2026-07-10',
                true,
                null,
                null,

                // 🔹 radi kraće u periodu
                barberId,
                '2026-07-15',
                '2026-07-17',
                false,
                '12:00:00',
                '16:00:00',
            ]
        );

        console.log('Uspesno seedovanje barber_working_overrides');
        return;
    }

    console.log('Neuspesno seedovanje barber_working_overrides (vec postoje podaci)');
}