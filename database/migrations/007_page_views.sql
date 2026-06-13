-- Migration 007: lightweight, privacy-respecting page-view tracking for real
-- visitor analytics (replaces the random/mock numbers on the dashboard).
-- Only an ip_hash (sha256 of ip + daily salt) is stored, never the raw IP.
-- Idempotent.

CREATE TABLE IF NOT EXISTS page_views (
    id          BIGSERIAL PRIMARY KEY,
    path        VARCHAR(512) NOT NULL,
    referrer    VARCHAR(512),
    session_id  VARCHAR(128),
    ip_hash     CHAR(64),
    user_agent  VARCHAR(512),
    is_bot      BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created  ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session  ON page_views (session_id);
-- (no functional date_trunc index: not IMMUTABLE for timestamptz; the created_at
--  index above already serves the monthly range queries.)
