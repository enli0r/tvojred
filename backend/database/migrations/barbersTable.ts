import { Connection } from 'mysql2/promise';

export async function createBarbersTable(db: Connection) {
  await db.query(`
        CREATE TABLE IF NOT EXISTS barbers (
            id INT AUTO_INCREMENT PRIMARY KEY,

            tenant_id INT NOT NULL,
            user_id INT NULL,

            name VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NULL,
            email VARCHAR(255) NULL,
            specialty VARCHAR(255) NULL,

            is_active BOOLEAN NOT NULL DEFAULT TRUE,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            CONSTRAINT fk_barbers_tenant
                FOREIGN KEY (tenant_id) REFERENCES tenants(id)
                ON DELETE CASCADE,

            CONSTRAINT fk_barbers_user
                FOREIGN KEY (user_id) REFERENCES users(id)
                ON DELETE SET NULL,

            INDEX idx_barbers_tenant (tenant_id),
            INDEX idx_barbers_user (user_id),
            INDEX idx_barbers_tenant_active (tenant_id, is_active)
        ) ENGINE=InnoDB
    `);
}