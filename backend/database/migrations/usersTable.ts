import { Connection } from "mysql2/promise";

export async function createUsersTable(db: Connection) {
    await db.query(`create table if not exists users(
            id int auto_increment primary key,
            name varchar(255) not null,
            phone varchar(50) not null unique,
            
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
}

// role enum('admin', 'barber', 'customer') not null default 'customer',