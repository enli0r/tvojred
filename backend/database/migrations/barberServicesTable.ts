import type { Connection } from 'mysql2/promise';

export async function createBarberServicesTable(db: Connection) {
    await db.query(`
    CREATE TABLE IF NOT EXISTS barber_services (
      id INT AUTO_INCREMENT PRIMARY KEY,

      barber_id INT NOT NULL,
      service_id INT NOT NULL,

      price DECIMAL(8, 2) NOT NULL,
      duration INT NOT NULL,                -- npr. trajanje u minutima
      is_active BOOLEAN NOT NULL DEFAULT TRUE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_barber_services_barber
        FOREIGN KEY (barber_id) REFERENCES barbers(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_barber_services_service
        FOREIGN KEY (service_id) REFERENCES services(id)
        ON DELETE CASCADE,

      INDEX idx_barber_services_barber (barber_id),
      INDEX idx_barber_services_service (service_id),
      UNIQUE KEY uniq_barber_service (barber_id, service_id)
    ) ENGINE=InnoDB
  `);
}