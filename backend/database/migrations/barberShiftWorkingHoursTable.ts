import type { Connection } from 'mysql2/promise';

export async function createBarberShiftWorkingHoursTable(db: Connection) {
    await db.query(`
    CREATE TABLE IF NOT EXISTS barber_shift_working_hours (
      id INT AUTO_INCREMENT PRIMARY KEY,

      barber_id INT NOT NULL,

      shift_number TINYINT NOT NULL, -- 1 = smena 1, 2 = smena 2
      day_of_week TINYINT NOT NULL, -- 0=nedelja, 1=ponedeljak ... 6=subota

      is_working BOOLEAN NOT NULL DEFAULT TRUE,
      start_time TIME NULL,
      end_time TIME NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_barber_shift_working_hours_barber
        FOREIGN KEY (barber_id) REFERENCES barbers(id)
        ON DELETE CASCADE,

      CONSTRAINT chk_barber_shift_working_hours_shift
        CHECK (shift_number IN (1, 2)),

      CONSTRAINT chk_barber_shift_working_hours_day
        CHECK (day_of_week BETWEEN 0 AND 6),

      CONSTRAINT chk_barber_shift_working_hours_time
        CHECK (
          (is_working = FALSE AND start_time IS NULL AND end_time IS NULL)
          OR
          (is_working = TRUE AND start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
        ),

      UNIQUE KEY uniq_barber_shift_day (barber_id, shift_number, day_of_week),
      INDEX idx_barber_shift_working_hours_barber (barber_id),
      INDEX idx_barber_shift_working_hours_shift (barber_id, shift_number)
    ) ENGINE=InnoDB
  `);
}