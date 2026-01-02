import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_static_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__static_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__static_pages_v_published_locale" AS ENUM('en', 'fa');
  CREATE TABLE "static_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_static_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "static_pages_locales" (
  	"title" varchar,
  	"search_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "static_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "_static_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_path" varchar,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__static_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__static_pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_static_pages_v_locales" (
  	"version_title" varchar,
  	"version_search_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_static_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "projects_summary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"paragraph" varchar NOT NULL
  );
  
  ALTER TABLE "pages_blocks_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_archive" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_categories_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_categories_fk";
  
  ALTER TABLE "case_studies_rels" DROP CONSTRAINT "case_studies_rels_case_study_type_fk";
  
  ALTER TABLE "_case_studies_v_rels" DROP CONSTRAINT "_case_studies_v_rels_case_study_type_fk";
  
  ALTER TABLE "search" DROP CONSTRAINT "search_hero_image_id_blog_media_id_fk";
  
  DROP INDEX "pages_rels_categories_id_idx";
  DROP INDEX "_pages_v_rels_categories_id_idx";
  DROP INDEX "case_studies_rels_case_study_type_id_idx";
  DROP INDEX "_case_studies_v_rels_case_study_type_id_idx";
  DROP INDEX "team_slug_idx";
  DROP INDEX "search_hero_image_idx";
  DROP INDEX "search_subtitle_idx";
  DROP INDEX "search_authors_idx";
  DROP INDEX "search_categories_idx";
  DROP INDEX "search_tags_idx";
  DROP INDEX "categories_slug_idx";
  ALTER TABLE "categories" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "authors" ADD COLUMN "associated_team_member_id" integer;
  ALTER TABLE "posts_populated_authors" ADD COLUMN "associated_team_member_id" integer;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "associated_team_member_id" integer;
  ALTER TABLE "categories" ADD COLUMN "slug_lock" boolean DEFAULT true;
  ALTER TABLE "case_studies" ADD COLUMN "project_type_id" integer;
  ALTER TABLE "case_studies_locales" ADD COLUMN "details" jsonb;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_project_type_id" integer;
  ALTER TABLE "_case_studies_v_locales" ADD COLUMN "version_details" jsonb;
  ALTER TABLE "projects" ADD COLUMN "featured_image_id" integer;
  ALTER TABLE "projects" ADD COLUMN "client_logo_id" integer;
  ALTER TABLE "projects_locales" ADD COLUMN "year" numeric NOT NULL;
  ALTER TABLE "projects_locales" ADD COLUMN "key_metrics_year_appointment" numeric;
  ALTER TABLE "projects_locales" ADD COLUMN "key_metrics_year_completed" numeric;
  ALTER TABLE "projects_locales" ADD COLUMN "key_metrics_project_area" numeric;
  ALTER TABLE "projects_rels" ADD COLUMN "team_id" integer;
  ALTER TABLE "team" ADD COLUMN "slug" varchar;
  ALTER TABLE "team" ADD COLUMN "slug_lock" boolean DEFAULT true;
  ALTER TABLE "team_locales" ADD COLUMN "role" varchar NOT NULL;
  ALTER TABLE "team_locales" ADD COLUMN "bio" varchar;
  ALTER TABLE "team_locales" ADD COLUMN "details" jsonb NOT NULL;
  ALTER TABLE "search_rels" ADD COLUMN "static_pages_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "blog_media_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "team_media_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "project_media_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "case_study_media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "static_pages_id" integer;
  ALTER TABLE "static_pages_locales" ADD CONSTRAINT "static_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."static_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "static_pages_rels" ADD CONSTRAINT "static_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."static_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "static_pages_rels" ADD CONSTRAINT "static_pages_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_static_pages_v" ADD CONSTRAINT "_static_pages_v_parent_id_static_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."static_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_static_pages_v_locales" ADD CONSTRAINT "_static_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_static_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_static_pages_v_rels" ADD CONSTRAINT "_static_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_static_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_static_pages_v_rels" ADD CONSTRAINT "_static_pages_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_summary" ADD CONSTRAINT "projects_summary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "static_pages_slug_idx" ON "static_pages" USING btree ("slug");
  CREATE INDEX "static_pages_updated_at_idx" ON "static_pages" USING btree ("updated_at");
  CREATE INDEX "static_pages_created_at_idx" ON "static_pages" USING btree ("created_at");
  CREATE INDEX "static_pages__status_idx" ON "static_pages" USING btree ("_status");
  CREATE UNIQUE INDEX "static_pages_locales_locale_parent_id_unique" ON "static_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "static_pages_rels_order_idx" ON "static_pages_rels" USING btree ("order");
  CREATE INDEX "static_pages_rels_parent_idx" ON "static_pages_rels" USING btree ("parent_id");
  CREATE INDEX "static_pages_rels_path_idx" ON "static_pages_rels" USING btree ("path");
  CREATE INDEX "static_pages_rels_tags_id_idx" ON "static_pages_rels" USING btree ("tags_id");
  CREATE INDEX "_static_pages_v_parent_idx" ON "_static_pages_v" USING btree ("parent_id");
  CREATE INDEX "_static_pages_v_version_version_slug_idx" ON "_static_pages_v" USING btree ("version_slug");
  CREATE INDEX "_static_pages_v_version_version_updated_at_idx" ON "_static_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_static_pages_v_version_version_created_at_idx" ON "_static_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_static_pages_v_version_version__status_idx" ON "_static_pages_v" USING btree ("version__status");
  CREATE INDEX "_static_pages_v_created_at_idx" ON "_static_pages_v" USING btree ("created_at");
  CREATE INDEX "_static_pages_v_updated_at_idx" ON "_static_pages_v" USING btree ("updated_at");
  CREATE INDEX "_static_pages_v_snapshot_idx" ON "_static_pages_v" USING btree ("snapshot");
  CREATE INDEX "_static_pages_v_published_locale_idx" ON "_static_pages_v" USING btree ("published_locale");
  CREATE INDEX "_static_pages_v_latest_idx" ON "_static_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_static_pages_v_locales_locale_parent_id_unique" ON "_static_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_static_pages_v_rels_order_idx" ON "_static_pages_v_rels" USING btree ("order");
  CREATE INDEX "_static_pages_v_rels_parent_idx" ON "_static_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_static_pages_v_rels_path_idx" ON "_static_pages_v_rels" USING btree ("path");
  CREATE INDEX "_static_pages_v_rels_tags_id_idx" ON "_static_pages_v_rels" USING btree ("tags_id");
  CREATE INDEX "projects_summary_order_idx" ON "projects_summary" USING btree ("_order");
  CREATE INDEX "projects_summary_parent_id_idx" ON "projects_summary" USING btree ("_parent_id");
  CREATE INDEX "projects_summary_locale_idx" ON "projects_summary" USING btree ("_locale");
  ALTER TABLE "authors" ADD CONSTRAINT "authors_associated_team_member_id_team_id_fk" FOREIGN KEY ("associated_team_member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_associated_team_member_id_team_id_fk" FOREIGN KEY ("associated_team_member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_associated_team_member_id_team_id_fk" FOREIGN KEY ("associated_team_member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_project_type_id_case_study_type_id_fk" FOREIGN KEY ("project_type_id") REFERENCES "public"."case_study_type"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_project_type_id_case_study_type_id_fk" FOREIGN KEY ("version_project_type_id") REFERENCES "public"."case_study_type"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_featured_image_id_project_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."project_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_client_logo_id_project_media_id_fk" FOREIGN KEY ("client_logo_id") REFERENCES "public"."project_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_static_pages_fk" FOREIGN KEY ("static_pages_id") REFERENCES "public"."static_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_blog_media_fk" FOREIGN KEY ("blog_media_id") REFERENCES "public"."blog_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_team_media_fk" FOREIGN KEY ("team_media_id") REFERENCES "public"."team_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_project_media_fk" FOREIGN KEY ("project_media_id") REFERENCES "public"."project_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_case_study_media_fk" FOREIGN KEY ("case_study_media_id") REFERENCES "public"."case_study_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_static_pages_fk" FOREIGN KEY ("static_pages_id") REFERENCES "public"."static_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "authors_associated_team_member_idx" ON "authors" USING btree ("associated_team_member_id");
  CREATE INDEX "posts_populated_authors_associated_team_member_idx" ON "posts_populated_authors" USING btree ("associated_team_member_id");
  CREATE INDEX "_posts_v_version_populated_authors_associated_team_membe_idx" ON "_posts_v_version_populated_authors" USING btree ("associated_team_member_id");
  CREATE INDEX "case_studies_project_type_idx" ON "case_studies" USING btree ("project_type_id");
  CREATE INDEX "_case_studies_v_version_version_project_type_idx" ON "_case_studies_v" USING btree ("version_project_type_id");
  CREATE INDEX "projects_featured_image_idx" ON "projects" USING btree ("featured_image_id");
  CREATE INDEX "projects_client_logo_idx" ON "projects" USING btree ("client_logo_id");
  CREATE INDEX "projects_rels_team_id_idx" ON "projects_rels" USING btree ("team_id");
  CREATE INDEX "team_slug_idx" ON "team" USING btree ("slug");
  CREATE INDEX "search_rels_static_pages_id_idx" ON "search_rels" USING btree ("static_pages_id");
  CREATE INDEX "search_rels_blog_media_id_idx" ON "search_rels" USING btree ("blog_media_id");
  CREATE INDEX "search_rels_team_media_id_idx" ON "search_rels" USING btree ("team_media_id");
  CREATE INDEX "search_rels_project_media_id_idx" ON "search_rels" USING btree ("project_media_id");
  CREATE INDEX "search_rels_case_study_media_id_idx" ON "search_rels" USING btree ("case_study_media_id");
  CREATE INDEX "payload_locked_documents_rels_static_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("static_pages_id");
  CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  ALTER TABLE "pages_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "categories" DROP COLUMN "generate_slug";
  ALTER TABLE "case_studies" DROP COLUMN "details";
  ALTER TABLE "case_studies_rels" DROP COLUMN "case_study_type_id";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_details";
  ALTER TABLE "_case_studies_v_rels" DROP COLUMN "case_study_type_id";
  ALTER TABLE "projects" DROP COLUMN "year";
  ALTER TABLE "team" DROP COLUMN "role";
  ALTER TABLE "team" DROP COLUMN "bio";
  ALTER TABLE "team_locales" DROP COLUMN "slug";
  ALTER TABLE "search" DROP COLUMN "hero_image_id";
  ALTER TABLE "search" DROP COLUMN "subtitle";
  ALTER TABLE "search" DROP COLUMN "authors";
  ALTER TABLE "search" DROP COLUMN "categories";
  ALTER TABLE "search" DROP COLUMN "tags";
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "static_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "static_pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "static_pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_static_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_static_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_static_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_summary" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "static_pages" CASCADE;
  DROP TABLE "static_pages_locales" CASCADE;
  DROP TABLE "static_pages_rels" CASCADE;
  DROP TABLE "_static_pages_v" CASCADE;
  DROP TABLE "_static_pages_v_locales" CASCADE;
  DROP TABLE "_static_pages_v_rels" CASCADE;
  DROP TABLE "projects_summary" CASCADE;
  ALTER TABLE "authors" DROP CONSTRAINT "authors_associated_team_member_id_team_id_fk";
  
  ALTER TABLE "posts_populated_authors" DROP CONSTRAINT "posts_populated_authors_associated_team_member_id_team_id_fk";
  
  ALTER TABLE "_posts_v_version_populated_authors" DROP CONSTRAINT "_posts_v_version_populated_authors_associated_team_member_id_team_id_fk";
  
  ALTER TABLE "case_studies" DROP CONSTRAINT "case_studies_project_type_id_case_study_type_id_fk";
  
  ALTER TABLE "_case_studies_v" DROP CONSTRAINT "_case_studies_v_version_project_type_id_case_study_type_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_featured_image_id_project_media_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_client_logo_id_project_media_id_fk";
  
  ALTER TABLE "projects_rels" DROP CONSTRAINT "projects_rels_team_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_static_pages_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_blog_media_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_team_media_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_project_media_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_case_study_media_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_static_pages_fk";
  
  DROP INDEX "authors_associated_team_member_idx";
  DROP INDEX "posts_populated_authors_associated_team_member_idx";
  DROP INDEX "_posts_v_version_populated_authors_associated_team_membe_idx";
  DROP INDEX "case_studies_project_type_idx";
  DROP INDEX "_case_studies_v_version_version_project_type_idx";
  DROP INDEX "projects_featured_image_idx";
  DROP INDEX "projects_client_logo_idx";
  DROP INDEX "projects_rels_team_id_idx";
  DROP INDEX "team_slug_idx";
  DROP INDEX "search_rels_static_pages_id_idx";
  DROP INDEX "search_rels_blog_media_id_idx";
  DROP INDEX "search_rels_team_media_id_idx";
  DROP INDEX "search_rels_project_media_id_idx";
  DROP INDEX "search_rels_case_study_media_id_idx";
  DROP INDEX "payload_locked_documents_rels_static_pages_id_idx";
  DROP INDEX "categories_slug_idx";
  ALTER TABLE "categories" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "pages_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "categories" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "case_studies" ADD COLUMN "details" jsonb;
  ALTER TABLE "case_studies_rels" ADD COLUMN "case_study_type_id" integer;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_details" jsonb;
  ALTER TABLE "_case_studies_v_rels" ADD COLUMN "case_study_type_id" integer;
  ALTER TABLE "projects" ADD COLUMN "year" numeric NOT NULL;
  ALTER TABLE "team" ADD COLUMN "role" varchar NOT NULL;
  ALTER TABLE "team" ADD COLUMN "bio" jsonb;
  ALTER TABLE "team_locales" ADD COLUMN "slug" varchar;
  ALTER TABLE "search" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "search" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "search" ADD COLUMN "authors" varchar;
  ALTER TABLE "search" ADD COLUMN "categories" varchar;
  ALTER TABLE "search" ADD COLUMN "tags" varchar;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_case_study_type_fk" FOREIGN KEY ("case_study_type_id") REFERENCES "public"."case_study_type"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_case_study_type_fk" FOREIGN KEY ("case_study_type_id") REFERENCES "public"."case_study_type"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_hero_image_id_blog_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."blog_media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "case_studies_rels_case_study_type_id_idx" ON "case_studies_rels" USING btree ("case_study_type_id");
  CREATE INDEX "_case_studies_v_rels_case_study_type_id_idx" ON "_case_studies_v_rels" USING btree ("case_study_type_id");
  CREATE UNIQUE INDEX "team_slug_idx" ON "team_locales" USING btree ("slug","_locale");
  CREATE INDEX "search_hero_image_idx" ON "search" USING btree ("hero_image_id");
  CREATE INDEX "search_subtitle_idx" ON "search" USING btree ("subtitle");
  CREATE INDEX "search_authors_idx" ON "search" USING btree ("authors");
  CREATE INDEX "search_categories_idx" ON "search" USING btree ("categories");
  CREATE INDEX "search_tags_idx" ON "search" USING btree ("tags");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  ALTER TABLE "authors" DROP COLUMN "associated_team_member_id";
  ALTER TABLE "posts_populated_authors" DROP COLUMN "associated_team_member_id";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "associated_team_member_id";
  ALTER TABLE "categories" DROP COLUMN "slug_lock";
  ALTER TABLE "case_studies" DROP COLUMN "project_type_id";
  ALTER TABLE "case_studies_locales" DROP COLUMN "details";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_project_type_id";
  ALTER TABLE "_case_studies_v_locales" DROP COLUMN "version_details";
  ALTER TABLE "projects" DROP COLUMN "featured_image_id";
  ALTER TABLE "projects" DROP COLUMN "client_logo_id";
  ALTER TABLE "projects_locales" DROP COLUMN "year";
  ALTER TABLE "projects_locales" DROP COLUMN "key_metrics_year_appointment";
  ALTER TABLE "projects_locales" DROP COLUMN "key_metrics_year_completed";
  ALTER TABLE "projects_locales" DROP COLUMN "key_metrics_project_area";
  ALTER TABLE "projects_rels" DROP COLUMN "team_id";
  ALTER TABLE "team" DROP COLUMN "slug";
  ALTER TABLE "team" DROP COLUMN "slug_lock";
  ALTER TABLE "team_locales" DROP COLUMN "role";
  ALTER TABLE "team_locales" DROP COLUMN "bio";
  ALTER TABLE "team_locales" DROP COLUMN "details";
  ALTER TABLE "search_rels" DROP COLUMN "static_pages_id";
  ALTER TABLE "search_rels" DROP COLUMN "blog_media_id";
  ALTER TABLE "search_rels" DROP COLUMN "team_media_id";
  ALTER TABLE "search_rels" DROP COLUMN "project_media_id";
  ALTER TABLE "search_rels" DROP COLUMN "case_study_media_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "static_pages_id";
  DROP TYPE "public"."enum_static_pages_status";
  DROP TYPE "public"."enum__static_pages_v_version_status";
  DROP TYPE "public"."enum__static_pages_v_published_locale";`)
}
