import { Connection } from "mysql2/promise";

export async function createTenantsTable(db: Connection) {
    await db.query(`
        CREATE TABLE IF NOT EXISTS tenants (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          slug VARCHAR (100) NOT NULL UNIQUE,
          phone VARCHAR (50) NOT NULL UNIQUE,
          email VARCHAR (255) DEFAULT NULL,
          address VARCHAR (255) DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

    console.log('Tabela tenants kreirana');
}