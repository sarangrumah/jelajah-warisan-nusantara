-- Create activity_log table for logging user/admin/visitor activities

CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_type VARCHAR(32) NOT NULL, -- 'visitor', 'admin', etc.
    user_id INTEGER NULL,
    session_id VARCHAR(128) NULL,
    ip_address VARCHAR(64) NULL,
    activity_type VARCHAR(64) NOT NULL,
    target_type VARCHAR(64) NULL,
    target_id VARCHAR(128) NULL,
    details JSONB NOT NULL,
    success BOOLEAN NULL
);

-- Indexes for efficient filtering and export
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_type ON activity_log (user_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log (user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_session_id ON activity_log (session_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_activity_type ON activity_log (activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_target_type ON activity_log (target_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_target_id ON activity_log (target_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_success ON activity_log (success);