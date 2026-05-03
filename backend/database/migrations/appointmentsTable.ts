import { Connection } from 'mysql2/promise';

export async function createAppointmentsTable(db: Connection) {
    await db.query(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INT AUTO_INCREMENT PRIMARY KEY,

            tenant_id INT NOT NULL,
            customer_id INT NOT NULL,
            barber_id INT NOT NULL,

            start_time DATETIME NOT NULL,
            end_time DATETIME NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            CONSTRAINT fk_appointments_tenant
                FOREIGN KEY (tenant_id) REFERENCES tenants(id)
                ON DELETE CASCADE,

            CONSTRAINT fk_appointments_customer
                FOREIGN KEY (customer_id) REFERENCES customers(id)
                ON DELETE CASCADE,

            CONSTRAINT fk_appointments_barber
                FOREIGN KEY (barber_id) REFERENCES barbers(id)
                ON DELETE CASCADE,

            CONSTRAINT uniq_barber_start_time
                UNIQUE (barber_id, start_time),

            INDEX idx_appointments_barber_time (barber_id, start_time, end_time),
            INDEX idx_appointments_tenant (tenant_id),
            INDEX idx_appointments_customer (customer_id),
            INDEX idx_appointments_barber (barber_id)
        ) ENGINE=InnoDB
    `);
}