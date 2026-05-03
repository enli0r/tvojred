import { Connection } from 'mysql2/promise';

export async function seedBarberBreakRepeatDays(db: Connection) {
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM barber_break_repeat_days`);
    const count = (rows as any)[0].count;

    if (count === 0) {
        const [breaks]: any = await db.query(`
      SELECT id
      FROM barber_breaks
      WHERE barber_id = 8
        AND repeat_type = 'weekly'
      ORDER BY id ASC
      LIMIT 1
    `);

        if (breaks.length === 0) {
            console.log('Nema weekly pauze za seedovanje dana');
            return;
        }

        const breakId = breaks[0].id;

        await db.query(
            `
      INSERT INTO barber_break_repeat_days (break_id, day_of_week)
      VALUES (?, ?), (?, ?)
      `,
            [
                breakId, 1, // ponedeljak
                breakId, 3, // sreda
            ]
        );

        console.log('Uspesno seedovanje barber_break_repeat_days');
        return;
    }

    console.log('Neuspesno seedovanje barber_break_repeat_days (vec postoje podaci)');
}