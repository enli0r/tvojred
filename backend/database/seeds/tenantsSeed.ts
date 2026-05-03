import mysql from 'mysql2/promise';
import { Connection } from "mysql2/promise";

export async function seedTenants(db: Connection) {
    const [rows] = await db.query('SELECT COUNT(*) as t from tenants');
    const count = (rows as any)[0].t;

    if (count === 0) {
        await db.query(`
      INSERT INTO tenants (id, name, slug, phone)
      VALUES 
        (1, 'Daca frizer', 'daca-frizer', '0634343434'),
        (2, 'Meca', 'meca', '062019333')
    `);
        console.log('Uspesno seedovanje tabele tenants')
    }

    console.log('Neuspesno seedovanje tabele tenants');
}