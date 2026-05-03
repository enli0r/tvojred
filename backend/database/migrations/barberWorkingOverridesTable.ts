import type { Connection } from 'mysql2/promise';

export async function createBarberWorkingOverridesTable(db: Connection) {
    await db.query(`
    CREATE TABLE IF NOT EXISTS barber_working_overrides (
      id INT AUTO_INCREMENT PRIMARY KEY,

      barber_id INT NOT NULL,

      start_date DATE NOT NULL,
      end_date DATE NOT NULL,

      is_closed BOOLEAN NOT NULL DEFAULT FALSE,

      start_time TIME NULL,
      end_time TIME NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_barber_working_overrides_barber
        FOREIGN KEY (barber_id) REFERENCES barbers(id)
        ON DELETE CASCADE,

      CONSTRAINT chk_barber_working_overrides_dates
        CHECK (start_date <= end_date),

      CONSTRAINT chk_barber_working_overrides_time
        CHECK (
          (is_closed = TRUE AND start_time IS NULL AND end_time IS NULL)
          OR
          (is_closed = FALSE AND start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
        ),

      INDEX idx_barber_working_overrides_barber (barber_id),
      INDEX idx_barber_working_overrides_dates (start_date, end_date)
    ) ENGINE=InnoDB
  `);
}