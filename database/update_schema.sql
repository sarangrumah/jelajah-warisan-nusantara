ALTER TABLE "media" RENAME TO "media_old";

CREATE TABLE "media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT,
    "image_url" TEXT,
    "file_url" TEXT,
    "categories" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "source" TEXT,
    "author" TEXT[],
    "type" VARCHAR(50) DEFAULT 'news',
    "is_active" BOOLEAN DEFAULT false,
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "published_date" TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "publication" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" VARCHAR(50) DEFAULT 'publication',
    "category" TEXT,
    "year" VARCHAR(4),
    "size" VARCHAR(20),
    "pages" INTEGER,
    "downloadCount" INTEGER DEFAULT 0,
    "published_at" DATE,
    "url" TEXT,
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,
    CONSTRAINT "publication_pkey" PRIMARY KEY ("id")
);

INSERT INTO "media" (id, title, image_url, file_url, categories, subtitle, description, source, author, type, is_active, is_approved, is_rejected, reason_rejected, created_at, updated_at, published_date)
SELECT id, title, image_url, file_url, categories, subtitle, description, source, author, type, is_active, is_approved, is_rejected, reason_rejected, created_at, updated_at, published_date
FROM "media_old";

DROP TABLE "media_old";