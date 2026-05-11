import { Connection } from "mysql2/promise";

export async function createUsersTable(db: Connection) {
    await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,

      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      phone_normalized VARCHAR(50) NOT NULL,

      role ENUM('admin', 'barber', 'customer') NOT NULL DEFAULT 'customer',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      UNIQUE KEY uniq_users_phone_normalized (phone_normalized),
      INDEX idx_users_phone (phone)
    ) ENGINE=InnoDB
  `);
}