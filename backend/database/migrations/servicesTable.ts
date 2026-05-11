import { Connection } from 'mysql2/promise';

export async function createServicesTable(db: Connection) {
    await db.query(`
        CREATE TABLE IF NOT EXISTS services (
            id INT AUTO_INCREMENT PRIMARY KEY,

            tenant_id INT NOT NULL,

            name VARCHAR(255) NOT NULL,
            description TEXT NULL,

            price DECIMAL(10,2) NOT NULL DEFAULT 0,
            duration_minutes INT NOT NULL DEFAULT 30,

            is_active BOOLEAN NOT NULL DEFAULT TRUE,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            CONSTRAINT fk_services_tenant
                FOREIGN KEY (tenant_id) REFERENCES tenants(id)
                ON DELETE CASCADE,

            INDEX idx_services_tenant (tenant_id),
            INDEX idx_services_tenant_active (tenant_id, is_active)
        ) ENGINE=InnoDB
    `);
}