import type { Connection } from 'mysql2/promise';

export async function createBarberWorkingHoursTable(db: Connection) {
    await db.query(`
    CREATE TABLE IF NOT EXISTS barber_working_hours (
      id INT AUTO_INCREMENT PRIMARY KEY,

      barber_id INT NOT NULL,
      day_of_week TINYINT NOT NULL, -- 0=nedelja ... 6=subota

      is_working BOOLEAN NOT NULL DEFAULT TRUE,
      start_time TIME NULL,
      end_time TIME NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_barber_working_hours_barber
        FOREIGN KEY (barber_id) REFERENCES barbers(id)
        ON DELETE CASCADE,

      CONSTRAINT chk_barber_working_hours_day
        CHECK (day_of_week BETWEEN 0 AND 6),

      CONSTRAINT chk_barber_working_hours_time
        CHECK (
          (is_working = FALSE AND start_time IS NULL AND end_time IS NULL)
          OR
          (is_working = TRUE AND start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
        ),

      UNIQUE KEY uniq_barber_day (barber_id, day_of_week),
      INDEX idx_barber_working_hours_barber (barber_id)
    ) ENGINE=InnoDB
  `);
}