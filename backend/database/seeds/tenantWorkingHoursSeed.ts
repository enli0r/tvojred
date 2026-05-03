import { Connection } from 'mysql2/promise';

export async function seedTenantWorkingHours(db: Connection) {
    const [rows] = await db.query(`select count(*) as twh from tenant_working_hours`);
    const count = (rows as any)[0].twh;

    if (count === 0) {
        await db.query(
            `insert into tenant_working_hours(id, tenant_id, day_of_week, is_working, start_time, end_time) 
             values 
             (?, ?, ?, ?, ?, ?),
             (?, ?, ?, ?, ?, ?),
             (?, ?, ?, ?, ?, ?),
             (?, ?, ?, ?, ?, ?),
             (?, ?, ?, ?, ?, ?),
             (?, ?, ?, ?, ?, ?),
             (?, ?, ?, ?, ?, ?)`,
            [
                1, 1, 0, false, null, null,       // nedelja
                2, 1, 1, true, '09:00:00', '17:00:00', // ponedeljak
                3, 1, 2, true, '09:00:00', '17:00:00', // utorak
                4, 1, 3, true, '09:00:00', '17:00:00', // sreda
                5, 1, 4, true, '09:00:00', '17:00:00', // četvrtak
                6, 1, 5, true, '09:00:00', '17:00:00', // petak
                7, 1, 6, true, '09:00:00', '13:00:00', // subota
            ]
        );

        console.log('Uspesno seedovanje tabele tenant_working_hours');
        return;
    }

    console.log('Neuspesno seedovanje tabele tenant_working_hours');
}