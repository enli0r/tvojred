import type { Connection } from 'mysql2/promise';

export async function createBarberBreaksTable(db: Connection) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS barber_breaks (
      id INT AUTO_INCREMENT PRIMARY KEY,

      barber_id INT NOT NULL,

      break_date DATE NOT NULL,
      day_of_week TINYINT NULL, 
      -- popunjen samo ako je weekly repeat

      start_time TIME NOT NULL,
      end_time TIME NOT NULL,

      repeat_type ENUM('none', 'weekly') NOT NULL DEFAULT 'none',

      repeat_until DATE NULL,
      -- NULL = ponavlja se zauvek

      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      note VARCHAR(255) NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_barber_breaks_barber
        FOREIGN KEY (barber_id) REFERENCES barbers(id)
        ON DELETE CASCADE,

      CONSTRAINT chk_barber_breaks_day
        CHECK (
          day_of_week IS NULL
          OR day_of_week BETWEEN 0 AND 6
        ),

      CONSTRAINT chk_barber_breaks_time
        CHECK (
          start_time < end_time
        ),

      CONSTRAINT chk_barber_breaks_repeat_logic
        CHECK (
          (repeat_type = 'none' AND day_of_week IS NULL)
          OR
          (repeat_type = 'weekly' AND day_of_week IS NOT NULL)
        ),

      CONSTRAINT chk_barber_breaks_repeat_until
        CHECK (
          repeat_until IS NULL
          OR break_date <= repeat_until
        ),

      INDEX idx_barber_breaks_barber (barber_id),
      INDEX idx_barber_breaks_date (barber_id, break_date),
      INDEX idx_barber_breaks_day (barber_id, day_of_week),
      INDEX idx_barber_breaks_active (barber_id, is_active)

    ) ENGINE=InnoDB
  `);
}