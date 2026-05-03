import { Connection } from 'mysql2/promise';

export async function seedUsers(db: Connection) {
    const [rows] = await db.query(`select count(*) as u from users`);
    const count = (rows as any)[0].u;

    // if (count === 0) {
    await db.query(`insert into users(name, phone) values('Mirko', '0638452725'), ('Stefan', '0638457205' )`);
    console.log('Uspesno seedovanje tabele users');
    return;
    // }

    console.log('Neuspesno seedovanje tabele users');

}