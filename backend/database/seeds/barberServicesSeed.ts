import { Connection } from 'mysql2/promise';

export async function seedBarberServices(db: Connection) {
    const [rows] = await db.query(`select count(*) as bs from barber_services`);
    const count = (rows as any)[0].bs;

    if (count === 0) {
        await db.query(`insert into barber_services(id, barber_id, service_id, price, duration, is_active) values(?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)`,
            [
                1, 8, 4, 700.00, 30, true,
                2, 8, 5, 300.00, 30, true,
            ]
        );
        console.log('Uspesno seedovanje tabele barber_services');
        return;
    }

    console.log('Neuspesno seedovanje tabele barber_services');

}