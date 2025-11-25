-- Add indexes to tb_memoryoftheworld_gallery to improve performance
-- This helps prevent 504 Gateway Time-out errors when fetching galleries

-- Index on foreign key for faster joins and lookups
CREATE INDEX IF NOT EXISTS idx_memory_gallery_mow_id ON tb_memoryoftheworld_gallery(id_memoryoftheworld);

-- Index on created_at for faster sorting (used in default getAll query)
CREATE INDEX IF NOT EXISTS idx_memory_gallery_created_at ON tb_memoryoftheworld_gallery(created_at DESC);

-- Index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_memory_gallery_is_active ON tb_memoryoftheworld_gallery(is_active);