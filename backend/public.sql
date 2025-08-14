/*
 Navicat Premium Dump SQL

 Source Server         : local_postgre
 Source Server Type    : PostgreSQL
 Source Server Version : 170005 (170005)
 Source Host           : localhost:5432
 Source Catalog        : heritage_museum_db
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 170005 (170005)
 File Encoding         : 65001

 Date: 03/08/2025 12:11:55
*/


-- ----------------------------
-- Type structure for app_role
-- ----------------------------
DROP TYPE IF EXISTS "public"."app_role";
CREATE TYPE "public"."app_role" AS ENUM (
  'admin',
  'editor',
  'viewer'
);

-- ----------------------------
-- Table structure for agenda_items
-- ----------------------------
DROP TABLE IF EXISTS "public"."agenda_items";
CREATE TABLE "public"."agenda_items" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "event_date" date NOT NULL,
  "event_time" time(6),
  "location" text COLLATE "pg_catalog"."default",
  "image_url" text COLLATE "pg_catalog"."default",
  "is_published" bool DEFAULT true,
  "created_by" uuid,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for banners
-- ----------------------------
DROP TABLE IF EXISTS "public"."banners";
CREATE TABLE "public"."banners" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "subtitle" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "image_url" text COLLATE "pg_catalog"."default",
  "start_date" timestamptz(6),
  "end_date" timestamptz(6),
  "is_published" bool NOT NULL DEFAULT true,
  "created_by" uuid,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for career_applications
-- ----------------------------
DROP TABLE IF EXISTS "public"."career_applications";
CREATE TABLE "public"."career_applications" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "opportunity_id" uuid,
  "full_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "phone" text COLLATE "pg_catalog"."default",
  "university" text COLLATE "pg_catalog"."default",
  "major" text COLLATE "pg_catalog"."default",
  "semester" int4,
  "program" text COLLATE "pg_catalog"."default",
  "motivation" text COLLATE "pg_catalog"."default",
  "cv_url" text COLLATE "pg_catalog"."default",
  "transcript_url" text COLLATE "pg_catalog"."default",
  "cover_letter_url" text COLLATE "pg_catalog"."default",
  "status" text COLLATE "pg_catalog"."default" DEFAULT 'pending'::text,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for career_opportunities
-- ----------------------------
DROP TABLE IF EXISTS "public"."career_opportunities";
CREATE TABLE "public"."career_opportunities" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "requirements" text COLLATE "pg_catalog"."default",
  "benefits" text COLLATE "pg_catalog"."default",
  "location" text COLLATE "pg_catalog"."default",
  "duration" text COLLATE "pg_catalog"."default",
  "application_deadline" timestamptz(6),
  "is_published" bool NOT NULL DEFAULT true,
  "created_by" uuid,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for content_sections
-- ----------------------------
DROP TABLE IF EXISTS "public"."content_sections";
CREATE TABLE "public"."content_sections" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "section_key" text COLLATE "pg_catalog"."default" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "content" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "is_published" bool DEFAULT true,
  "created_by" uuid,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for faqs
-- ----------------------------
DROP TABLE IF EXISTS "public"."faqs";
CREATE TABLE "public"."faqs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "question" text COLLATE "pg_catalog"."default" NOT NULL,
  "answer" text COLLATE "pg_catalog"."default" NOT NULL,
  "category" text COLLATE "pg_catalog"."default",
  "order_index" int4 DEFAULT 0,
  "is_published" bool NOT NULL DEFAULT true,
  "created_by" uuid,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for media_items
-- ----------------------------
DROP TABLE IF EXISTS "public"."media_items";
CREATE TABLE "public"."media_items" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" text COLLATE "pg_catalog"."default" NOT NULL,
  "category" text COLLATE "pg_catalog"."default",
  "excerpt" text COLLATE "pg_catalog"."default",
  "content" text COLLATE "pg_catalog"."default",
  "image_url" text COLLATE "pg_catalog"."default",
  "file_url" text COLLATE "pg_catalog"."default",
  "tags" text[] COLLATE "pg_catalog"."default",
  "is_published" bool NOT NULL DEFAULT true,
  "published_at" timestamptz(6),
  "created_by" uuid,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for museums
-- ----------------------------
DROP TABLE IF EXISTS "public"."museums";
CREATE TABLE "public"."museums" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "location" text COLLATE "pg_catalog"."default",
  "address" text COLLATE "pg_catalog"."default",
  "latitude" numeric,
  "longitude" numeric,
  "image_url" text COLLATE "pg_catalog"."default",
  "gallery_images" text[] COLLATE "pg_catalog"."default",
  "opening_hours" jsonb,
  "contact_info" jsonb,
  "is_published" bool NOT NULL DEFAULT true,
  "created_by" uuid,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for news_articles
-- ----------------------------
DROP TABLE IF EXISTS "public"."news_articles";
CREATE TABLE "public"."news_articles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" text COLLATE "pg_catalog"."default" NOT NULL,
  "excerpt" text COLLATE "pg_catalog"."default",
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "featured_image_url" text COLLATE "pg_catalog"."default",
  "is_published" bool DEFAULT true,
  "published_at" timestamptz(6),
  "created_by" uuid,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for profiles
-- ----------------------------
DROP TABLE IF EXISTS "public"."profiles";
CREATE TABLE "public"."profiles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "display_name" text COLLATE "pg_catalog"."default",
  "avatar_url" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_roles";
CREATE TABLE "public"."user_roles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "role" "public"."app_role" NOT NULL DEFAULT 'viewer'::app_role,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "password_hash" text COLLATE "pg_catalog"."default" NOT NULL,
  "email_verified" bool DEFAULT false,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Function structure for has_role
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."has_role"("_user_id" uuid, "_role" "public"."app_role");
CREATE FUNCTION "public"."has_role"("_user_id" uuid, "_role" "public"."app_role")
  RETURNS "pg_catalog"."bool" AS $BODY$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$BODY$
  LANGUAGE sql STABLE
  COST 100;

-- ----------------------------
-- Function structure for is_admin_or_editor
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."is_admin_or_editor"("_user_id" uuid);
CREATE FUNCTION "public"."is_admin_or_editor"("_user_id" uuid)
  RETURNS "pg_catalog"."bool" AS $BODY$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'editor')
  )
$BODY$
  LANGUAGE sql STABLE
  COST 100;

-- ----------------------------
-- Function structure for update_updated_at_column
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_updated_at_column"();
CREATE FUNCTION "public"."update_updated_at_column"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Indexes structure for table agenda_items
-- ----------------------------
CREATE INDEX "idx_agenda_items_date" ON "public"."agenda_items" USING btree (
  "event_date" "pg_catalog"."date_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table agenda_items
-- ----------------------------
CREATE TRIGGER "update_agenda_items_updated_at" BEFORE UPDATE ON "public"."agenda_items"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table agenda_items
-- ----------------------------
ALTER TABLE "public"."agenda_items" ADD CONSTRAINT "agenda_items_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Triggers structure for table banners
-- ----------------------------
CREATE TRIGGER "update_banners_updated_at" BEFORE UPDATE ON "public"."banners"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table banners
-- ----------------------------
ALTER TABLE "public"."banners" ADD CONSTRAINT "banners_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table career_applications
-- ----------------------------
CREATE INDEX "idx_career_applications_opportunity" ON "public"."career_applications" USING btree (
  "opportunity_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table career_applications
-- ----------------------------
CREATE TRIGGER "update_career_applications_updated_at" BEFORE UPDATE ON "public"."career_applications"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table career_applications
-- ----------------------------
ALTER TABLE "public"."career_applications" ADD CONSTRAINT "career_applications_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table career_opportunities
-- ----------------------------
CREATE INDEX "idx_career_opportunities_type" ON "public"."career_opportunities" USING btree (
  "type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table career_opportunities
-- ----------------------------
CREATE TRIGGER "update_career_opportunities_updated_at" BEFORE UPDATE ON "public"."career_opportunities"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table career_opportunities
-- ----------------------------
ALTER TABLE "public"."career_opportunities" ADD CONSTRAINT "career_opportunities_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table content_sections
-- ----------------------------
CREATE INDEX "idx_content_sections_section_key" ON "public"."content_sections" USING btree (
  "section_key" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table content_sections
-- ----------------------------
CREATE TRIGGER "update_content_sections_updated_at" BEFORE UPDATE ON "public"."content_sections"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table content_sections
-- ----------------------------
ALTER TABLE "public"."content_sections" ADD CONSTRAINT "content_sections_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table faqs
-- ----------------------------
CREATE INDEX "idx_faqs_category" ON "public"."faqs" USING btree (
  "category" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table faqs
-- ----------------------------
CREATE TRIGGER "update_faqs_updated_at" BEFORE UPDATE ON "public"."faqs"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table faqs
-- ----------------------------
ALTER TABLE "public"."faqs" ADD CONSTRAINT "faqs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table media_items
-- ----------------------------
CREATE INDEX "idx_media_items_type" ON "public"."media_items" USING btree (
  "type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table media_items
-- ----------------------------
CREATE TRIGGER "update_media_items_updated_at" BEFORE UPDATE ON "public"."media_items"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table media_items
-- ----------------------------
ALTER TABLE "public"."media_items" ADD CONSTRAINT "media_items_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table museums
-- ----------------------------
CREATE INDEX "idx_museums_type" ON "public"."museums" USING btree (
  "type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table museums
-- ----------------------------
CREATE TRIGGER "update_museums_updated_at" BEFORE UPDATE ON "public"."museums"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table museums
-- ----------------------------
ALTER TABLE "public"."museums" ADD CONSTRAINT "museums_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table news_articles
-- ----------------------------
CREATE INDEX "idx_news_articles_published" ON "public"."news_articles" USING btree (
  "is_published" "pg_catalog"."bool_ops" ASC NULLS LAST,
  "published_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_news_articles_slug" ON "public"."news_articles" USING btree (
  "slug" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table news_articles
-- ----------------------------
CREATE TRIGGER "update_news_articles_updated_at" BEFORE UPDATE ON "public"."news_articles"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table news_articles
-- ----------------------------
ALTER TABLE "public"."news_articles" ADD CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table profiles
-- ----------------------------
CREATE INDEX "idx_profiles_user_id" ON "public"."profiles" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table profiles
-- ----------------------------
CREATE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Uniques structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id");

-- ----------------------------
-- Primary Key structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table user_roles
-- ----------------------------
CREATE INDEX "idx_user_roles_user_id" ON "public"."user_roles" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table user_roles
-- ----------------------------
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_role_key" UNIQUE ("user_id", "role");

-- ----------------------------
-- Primary Key structure for table user_roles
-- ----------------------------
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table users
-- ----------------------------
CREATE INDEX "idx_users_email" ON "public"."users" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table users
-- ----------------------------
CREATE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
