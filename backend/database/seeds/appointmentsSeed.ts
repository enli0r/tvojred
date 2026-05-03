import { Connection } from "mysql2/promise";

export async function seedAppointments(db: Connection) {
    const [rows] = await db.query(`SELECT COUNT(*) as a FROM appointments`);
    const count = (rows as any)[0].a;

    if (count > 0) {
        console.log("Tabela appointments već ima podatke");
        return;
    }

    const values: any[] = [];
    const placeholders: string[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 0; day < 7; day++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + day);

        for (let i = 0; i < 8; i++) {
            const start = new Date(currentDate);
            start.setHours(9, i * 30, 0, 0);

            const end = new Date(start);
            end.setMinutes(start.getMinutes() + 30);

            placeholders.push("(?, ?, ?, ?, ?, ?)");
            values.push(
                1, // tenant_id
                2, // customer_id
                8, // barber_id
                1, // barber_service_id
                start,
                end
            );
        }
    }

    await db.query(
        `
      INSERT INTO appointments 
      (tenant_id, customer_id, barber_id, barber_service_id, start_time, end_time)
      VALUES ${placeholders.join(", ")}
    `,
        values
    );

    console.log("Uspesno seedovanje tabele appointments");
}