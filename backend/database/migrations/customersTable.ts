import type { Connection } from 'mysql2/promise';

export async function createCustomersTable(db: Connection) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,

      user_id INT NOT NULL,
      tenant_id INT NOT NULL,

      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_customers_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_customers_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON DELETE CASCADE,

      UNIQUE KEY uniq_customer_per_tenant_user (tenant_id, user_id),

      INDEX idx_customers_user (user_id),
      INDEX idx_customers_tenant (tenant_id),
      INDEX idx_customers_phone (phone)
    ) ENGINE=InnoDB
  `);
}