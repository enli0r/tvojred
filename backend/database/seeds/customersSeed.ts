import { Connection } from 'mysql2/promise';

export async function seedCustomers(db: Connection) {
    const [rows] = await db.query(`select count(*) as c from customers`);
    const count = (rows as any)[0].c;

    if (count === 0) {
        await db.query(`insert into customers(name, user_id, tenant_id, phone) values(?, ?, ?, ?)`,
            ['Milan', 1, 1, '0638457332']
        );
        console.log('Uspesno seedovanje tabele customers');
        return;
    }

    console.log('Neuspesno seedovanje tabele customers');

}