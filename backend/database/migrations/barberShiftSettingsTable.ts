import type { Connection } from 'mysql2/promise';

export async function createBarberShiftSettingsTable(db: Connection) {
    await db.query(`
    CREATE TABLE IF NOT EXISTS barber_shift_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,

      barber_id INT NOT NULL,

      work_mode ENUM('single_shift', 'alternating_shifts') NOT NULL DEFAULT 'single_shift',

      rotation_starts_at DATE NULL,

      is_active BOOLEAN NOT NULL DEFAULT TRUE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_barber_shift_settings_barber
        FOREIGN KEY (barber_id) REFERENCES barbers(id)
        ON DELETE CASCADE,

      CONSTRAINT chk_barber_shift_settings_rotation
        CHECK (
          work_mode = 'single_shift'
          OR
          (work_mode = 'alternating_shifts' AND rotation_starts_at IS NOT NULL)
        ),

      UNIQUE KEY uniq_barber_shift_settings (barber_id),
      INDEX idx_barber_shift_settings_barber (barber_id),
      INDEX idx_barber_shift_settings_mode (barber_id, work_mode)
    ) ENGINE=InnoDB
  `);
}