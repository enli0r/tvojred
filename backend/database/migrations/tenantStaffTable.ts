import { Connection } from 'mysql2/promise';

export async function createTenantStaffTable(db: Connection) {
    await db.query(`
        CREATE TABLE IF NOT EXISTS tenant_staff (
            id INT AUTO_INCREMENT PRIMARY KEY,

            tenant_id INT NOT NULL,
            user_id INT NOT NULL,

            role ENUM('owner', 'admin', 'barber') NOT NULL DEFAULT 'barber',

            is_active BOOLEAN NOT NULL DEFAULT TRUE,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            CONSTRAINT fk_tenant_staff_tenant
                FOREIGN KEY (tenant_id) REFERENCES tenants(id)
                ON DELETE CASCADE,

            CONSTRAINT fk_tenant_staff_user
                FOREIGN KEY (user_id) REFERENCES users(id)
                ON DELETE CASCADE,

            UNIQUE KEY uniq_tenant_staff_user
                (tenant_id, user_id),

            INDEX idx_tenant_staff_tenant
                (tenant_id),

            INDEX idx_tenant_staff_user
                (user_id),

            INDEX idx_tenant_staff_role
                (tenant_id, role),

            INDEX idx_tenant_staff_active
                (tenant_id, is_active)
        ) ENGINE=InnoDB
    `);
}