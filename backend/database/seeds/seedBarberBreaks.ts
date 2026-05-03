import { Connection } from 'mysql2/promise';

export async function seedBarberBreaks(db: Connection) {
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM barber_breaks`);
    const count = (rows as any)[0].count;

    if (count === 0) {
        await db.query(
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
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?)
      `,
            [
                // jednokratna pauza
                8,
                '2026-04-10',
                '12:00:00',
                '12:30:00',
                'none',
                null,
                true,
                'Jednokratna pauza',

                // daily pauza
                8,
                '2026-04-11',
                '14:00:00',
                '14:30:00',
                'daily',
                '2026-04-15',
                true,
                'Svakog dana',

                // weekly pauza
                8,
                '2026-04-07',
                '10:00:00',
                '10:30:00',
                'weekly',
                '2026-05-31',
                true,
                'Ponedeljkom i sredom',
            ]
        );

        console.log('Uspesno seedovanje barber_breaks');
        return;
    }

    console.log('Neuspesno seedovanje barber_breaks (vec postoje podaci)');
}