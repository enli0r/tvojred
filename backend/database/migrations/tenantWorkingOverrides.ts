import type { Connection } from 'mysql2/promise';

export async function createTenantWorkingOverridesTable(db: Connection) {
    await db.query(`
    CREATE TABLE IF NOT EXISTS tenant_working_overrides (
      id INT AUTO_INCREMENT PRIMARY KEY,

      tenant_id INT NOT NULL,

      start_date DATE NOT NULL,
      end_date DATE NOT NULL,

      is_closed BOOLEAN NOT NULL DEFAULT FALSE,
      start_time TIME NULL,
      end_time TIME NULL,

      note VARCHAR(255) NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_tenant_working_overrides_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON DELETE CASCADE,

      CONSTRAINT chk_tenant_working_overrides_dates
        CHECK (start_date <= end_date),

      CONSTRAINT chk_tenant_working_overrides_time
        CHECK (
          (is_closed = TRUE AND start_time IS NULL AND end_time IS NULL)
          OR
          (is_closed = FALSE AND start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
        ),

      INDEX idx_tenant_working_overrides_tenant (tenant_id),
      INDEX idx_tenant_working_overrides_range (tenant_id, start_date, end_date)
    ) ENGINE=InnoDB
  `);
}