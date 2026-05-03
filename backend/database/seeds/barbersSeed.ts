import { Connection } from 'mysql2/promise';

export async function seedBarbers(db: Connection) {
    const [rows] = await db.query(`select count(*) as b from barbers`);
    const count = (rows as any)[0].b;

    await db.query(`insert into barbers(name, user_id, tenant_id, phone) values (?, ?, ?, ?)`,
        ['Mirko', 2, 1, '0638452725']
    );

    console.log('Uspesno seedovanje tabele barbers');
    return;


    console.log('Neuspesno seedovanje tabele barbers');

}