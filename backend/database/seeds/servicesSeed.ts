import { Connection } from 'mysql2/promise';

export async function seedServices(db: Connection) {
    const [rows] = await db.query(`select count(*) as s from services`);
    const count = (rows as any)[0].s;

    if (count === 0) {
        console.log(count);
        await db.query(`insert into services(name) values('sisanje'), ('brada')`);
        console.log('Uspesno seedovanje tabele services');
        return;
    }

    console.log('Neuspesno seedovanje tabele services');

}