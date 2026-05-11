import { Connection } from "mysql2/promise";

export async function createCustomersTable(db: Connection) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,

      tenant_id INT NOT NULL,
      user_id INT NOT NULL,

      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      phone_normalized VARCHAR(50) NOT NULL,

      is_blocked BOOLEAN NOT NULL DEFAULT FALSE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_customers_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_customers_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

      UNIQUE KEY uniq_customer_tenant_user (tenant_id, user_id),
      UNIQUE KEY uniq_customer_tenant_phone (tenant_id, phone_normalized),

      INDEX idx_customers_tenant (tenant_id),
      INDEX idx_customers_user (user_id),
      INDEX idx_customers_phone_normalized (phone_normalized)
    ) ENGINE=InnoDB
  `);
}