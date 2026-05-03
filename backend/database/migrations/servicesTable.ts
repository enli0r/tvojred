import { Connection } from "mysql2/promise";

export async function createServicesTable(db: Connection) {
    await db.query(`create table if not exists services(
            id int auto_increment primary key,
            name varchar(255) not null,
            description text default null,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
}