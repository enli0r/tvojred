import type { Connection } from 'mysql2/promise';

export async function createTenantWorkingHoursTable(db: Connection) {
    await db.query(`
    CREATE TABLE IF NOT EXISTS tenant_working_hours (
      id INT AUTO_INCREMENT PRIMARY KEY,

      tenant_id INT NOT NULL,
      day_of_week TINYINT NOT NULL, -- 0=nedelja, 1=ponedeljak ... 6=subota

      is_working BOOLEAN NOT NULL DEFAULT TRUE,
      start_time TIME NULL,
      end_time TIME NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_tenant_working_hours_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON DELETE CASCADE,

      CONSTRAINT chk_tenant_working_hours_day
        CHECK (day_of_week BETWEEN 0 AND 6),

      CONSTRAINT chk_tenant_working_hours_time
        CHECK (
          (is_working = FALSE AND start_time IS NULL AND end_time IS NULL)
          OR
          (is_working = TRUE AND start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
        ),

      UNIQUE KEY uniq_tenant_day (tenant_id, day_of_week),
      INDEX idx_tenant_working_hours_tenant (tenant_id)
    ) ENGINE=InnoDB
  `);
}