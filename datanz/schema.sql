CREATE TABLE data_nz_files (
  id BIGINT PRIMARY KEY,
  path VARCHAR(1024) NOT NULL UNIQUE,
  jenis VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'aktif',
  commit_id CHAR(40) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_data_nz_status ON data_nz_files(status);
CREATE INDEX idx_data_nz_jenis ON data_nz_files(jenis);
