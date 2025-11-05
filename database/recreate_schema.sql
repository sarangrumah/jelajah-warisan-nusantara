-- Drop existing tables
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "role" CASCADE;
DROP TABLE IF EXISTS "user_role" CASCADE;
DROP TABLE IF EXISTS "activity_log" CASCADE;
DROP TABLE IF EXISTS "banner_management" CASCADE;
DROP TABLE IF EXISTS "company_profile_management" CASCADE;
DROP TABLE IF EXISTS "event_management" CASCADE;
DROP TABLE IF EXISTS "faq_management" CASCADE;
DROP TABLE IF EXISTS "media" CASCADE;
DROP TABLE IF EXISTS "memory_of_world" CASCADE;
DROP TABLE IF EXISTS "merchandise" CASCADE;
DROP TABLE IF EXISTS "museum" CASCADE;
DROP TABLE IF EXISTS "pemanfaatan_asset" CASCADE;
DROP TABLE IF EXISTS "site_management" CASCADE;
DROP TABLE IF EXISTS "translation" CASCADE;

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS user_id_seq;
DROP SEQUENCE IF EXISTS role_id_seq;

-- Drop types if they exist
DROP TYPE IF EXISTS "role_name";

CREATE TYPE "role_name" AS ENUM ('super-admin', 'admin', 'user', 'viewer', 'editor', 'approver');

CREATE SEQUENCE user_id_seq;

CREATE TABLE "user" (
    "id" INTEGER NOT NULL DEFAULT nextval('user_id_seq'),
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE role_id_seq;

CREATE TABLE "role" (
    "id" INTEGER NOT NULL DEFAULT nextval('role_id_seq'),
    "name" role_name NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

INSERT INTO "role" ("name") VALUES
('super-admin'),
('admin'),
('user'),
('viewer'),
('editor'),
('approver')
ON CONFLICT DO NOTHING;

CREATE TABLE "user_role" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("user_id", "role_id")
);

ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "activity_log" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "translation" (
    "id" SERIAL NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "translation_pkey" PRIMARY KEY ("id"),
    UNIQUE ("language", "key")
);

CREATE TABLE "banner_management" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255),
    "subtitle" TEXT,
    "image_url" VARCHAR(255) NOT NULL,
    "button_text" VARCHAR(100),
    "button_url" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,
    "order" INTEGER,

    CONSTRAINT "banner_management_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_profile_management" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT,
    "content" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
       "is_active" BOOLEAN DEFAULT false,
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,

    CONSTRAINT "company_profile_management_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "event_management" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT,
    "category" TEXT,
    "date" TEXT,
    "time" TEXT,
    "location" TEXT,
    "address" TEXT,
    "participants" INTEGER,
    "description" TEXT,
    "image_url" TEXT,
    "status" TEXT,
    "highlights" JSONB,
    "schedule" JSONB,
    "contact" JSONB,
    "requirements" JSONB,
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,

    CONSTRAINT "event_management_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "faq_management" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question" TEXT,
    "answer" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
     "is_active" BOOLEAN DEFAULT false,
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,

    CONSTRAINT "faq_management_pkey" PRIMARY KEY ("id")
);

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

CREATE TABLE "memory_of_world" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT,
    "year_inscribed" INTEGER,
    "category" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,

    CONSTRAINT "memory_of_world_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "merchandise" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "stock" INTEGER,
    "image_url" TEXT,
    "category" TEXT,
    "availability" TEXT,
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,

    CONSTRAINT "merchandise_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "museum" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "data" JSONB,
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,

    CONSTRAINT "museum_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pemanfaatan_asset" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "location" TEXT,
    "category" TEXT,
    "image_url" TEXT,
    "shortLocation" TEXT,
    "area" TEXT,
    "fasilitas" TEXT[],
    "tarif" TEXT,
    "overtime" TEXT,
    "fasilitasTambahan" TEXT[],
    "ketentuanUmum" TEXT[],
    "kapasitas" TEXT,
    "ukuran" TEXT,
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,

    CONSTRAINT "pemanfaatan_asset_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "site_management" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT,
    "subtitle" TEXT,
    "type" TEXT,
    "location" TEXT,
    "period" TEXT,
    "image_url" TEXT,
    "description" TEXT,
    "full_description" TEXT,
    "details" JSONB,
    "visit_info" JSONB,
    "facilities" TEXT[],
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,

    CONSTRAINT "site_management_pkey" PRIMARY KEY ("id")
);

-- Seed initial data
INSERT INTO "user" ("username", "email", "password", "is_active", "updated_at") VALUES
('superadmin', 'superadmin@example.com', '$2a$10$C.S33D5/Z8z.N.1jO3bF/.R6b.T.XmYQ5mCjO3mXzY5mCjO3mXzY5', true, NOW()),
('admin', 'admin@example.com', '$2a$10$C.S33D5/Z8z.N.1jO3bF/.R6b.T.XmYQ5mCjO3mXzY5mCjO3mXzY5', true, NOW()),
('editor', 'editor@example.com', '$2a$10$C.S33D5/Z8z.N.1jO3bF/.R6b.T.XmYQ5mCjO3mXzY5mCjO3mXzY5', true, NOW()),
('viewer', 'viewer@example.com', '$2a$10$C.S33D5/Z8z.N.1jO3bF/.R6b.T.XmYQ5mCjO3mXzY5mCjO3mXzY5', true, NOW());

-- Assign roles to users
-- Note: Role IDs might vary if they are not created in a consistent order.
-- Assuming 1:super-admin, 2:admin, 3:user, 4:viewer, 5:editor, 6:approver
INSERT INTO "user_role" ("user_id", "role_id") VALUES
((SELECT id FROM "user" WHERE username = 'superadmin'), (SELECT id FROM "role" WHERE name = 'super-admin')),
((SELECT id FROM "user" WHERE username = 'admin'), (SELECT id FROM "role" WHERE name = 'admin')),
((SELECT id FROM "user" WHERE username = 'editor'), (SELECT id FROM "role" WHERE name = 'editor')),
((SELECT id FROM "user" WHERE username = 'viewer'), (SELECT id FROM "role" WHERE name = 'viewer'));

ALTER TABLE "user"
ADD CONSTRAINT "user_email_key" UNIQUE ("email");