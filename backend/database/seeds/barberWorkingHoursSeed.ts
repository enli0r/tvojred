import { Connection } from 'mysql2/promise';

export async function seedBarberWorkingHours(db: Connection) {
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM barber_working_hours`);
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
      INSERT INTO barber_working_hours
      (barber_id, day_of_week, is_working, start_time, end_time)
      VALUES
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?)
      `,
            [
                // ponedeljak - petak
                barberId, 1, true, '09:00:00', '17:00:00',
                barberId, 2, true, '09:00:00', '17:00:00',
                barberId, 3, true, '09:00:00', '17:00:00',
                barberId, 4, true, '09:00:00', '17:00:00',
                barberId, 5, true, '09:00:00', '17:00:00',

                // subota
                barberId, 6, true, '09:00:00', '13:00:00',

                // nedelja
                barberId, 0, false, null, null,
            ]
        );

        console.log('Uspesno seedovanje barber_working_hours');
        return;
    }

    console.log('Neuspesno seedovanje barber_working_hours (vec postoje podaci)');
}