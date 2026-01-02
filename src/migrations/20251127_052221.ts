import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'fa');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'management');
  CREATE TYPE "public"."enum_documents_category" AS ENUM('report', 'legal', 'presentation', 'general');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'fa');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'fa');
  CREATE TYPE "public"."enum_feature_list_value_type" AS ENUM('boolean', 'number', 'text', 'sqm');
  CREATE TYPE "public"."section_type_enum" AS ENUM('primary_features', 'amenities', 'building_amenities', 'custom');
  CREATE TYPE "public"."enum_case_studies_project_status" AS ENUM('concept', 'in_progress', 'completed');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__feature_list_v_value_type" AS ENUM('boolean', 'number', 'text', 'sqm');
  CREATE TYPE "public"."enum__case_studies_v_version_project_status" AS ENUM('concept', 'in_progress', 'completed');
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_published_locale" AS ENUM('en', 'fa');
  CREATE TYPE "public"."enum_projects_project_status" AS ENUM('concept', 'in_progress', 'completed');
  CREATE TYPE "public"."enum_team_org_roles" AS ENUM('leadership', 'representative', 'team', 'contractor');
  CREATE TYPE "public"."enum_chegall_inquiries_type" AS ENUM('general', 'investor');
  CREATE TYPE "public"."enum_chegall_inquiries_source" AS ENUM('google', 'social_media', 'referral', 'advertisement', 'other');
  CREATE TYPE "public"."enum_chegall_inquiries_inquiry_type" AS ENUM('supply', 'job', 'general', 'other');
  CREATE TYPE "public"."enum_chegall_inquiries_investment_range" AS ENUM('<5B', '5B-20B', '20B-100B', '>100B');
  CREATE TYPE "public"."enum_chegall_inquiries_investment_timeline" AS ENUM('immediate', '1-3m', '3-6m', 'researching');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"category" "enum_documents_category" DEFAULT 'general',
  	"prefix" varchar DEFAULT 'chegall-cms/documents/public',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"user_account_id" integer,
  	"twitter" varchar,
  	"linkedin" varchar,
  	"instagram" varchar,
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "authors_locales" (
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tags_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar
  );
  
  CREATE TABLE "posts_populated_authors_locales" (
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_version_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"keyword" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_populated_authors_locales" (
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_locales" (
  	"caption" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "blog_media_locales" (
  	"caption" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "blog_categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "blog_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_categories_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "case_studies_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar
  );
  
  CREATE TABLE "case_studies_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar
  );
  
  CREATE TABLE "case_studies_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"award" varchar
  );
  
  CREATE TABLE "feature_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value_type" "enum_feature_list_value_type",
  	"boolean_value" boolean,
  	"number_value" numeric,
  	"text_value" varchar
  );
  
  CREATE TABLE "features_by_sec" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_type" "section_type_enum" DEFAULT 'primary_features',
  	"custom_section_name" varchar
  );
  
  CREATE TABLE "case_studies_project_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project_status" "enum_case_studies_project_status",
  	"location_latitude" varchar,
  	"location_longitude" varchar,
  	"key_metrics_year_appointment" numeric,
  	"key_metrics_year_completed" numeric,
  	"key_metrics_project_area" numeric,
  	"featured_image_id" integer,
  	"details" jsonb,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "case_studies_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"location_city" varchar,
  	"location_province" varchar,
  	"location_country" varchar,
  	"location_district" varchar,
  	"client" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"case_study_type_id" integer,
  	"team_id" integer,
  	"case_study_media_id" integer
  );
  
  CREATE TABLE "_case_studies_v_version_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"keyword" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"award" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_feature_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value_type" "enum__feature_list_v_value_type",
  	"boolean_value" boolean,
  	"number_value" numeric,
  	"text_value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_features_by_sec_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_type" "section_type_enum" DEFAULT 'primary_features',
  	"custom_section_name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_project_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_project_status" "enum__case_studies_v_version_project_status",
  	"version_location_latitude" varchar,
  	"version_location_longitude" varchar,
  	"version_key_metrics_year_appointment" numeric,
  	"version_key_metrics_year_completed" numeric,
  	"version_key_metrics_project_area" numeric,
  	"version_featured_image_id" integer,
  	"version_details" jsonb,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__case_studies_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_case_studies_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_location_city" varchar,
  	"version_location_province" varchar,
  	"version_location_country" varchar,
  	"version_location_district" varchar,
  	"version_client" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_case_studies_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"case_study_type_id" integer,
  	"team_id" integer,
  	"case_study_media_id" integer
  );
  
  CREATE TABLE "case_study_type_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "case_study_type" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_study_type_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "case_study_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"placeholder" varchar,
  	"prefix" varchar DEFAULT 'chegall-cms/case-studies/',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar,
  	"sizes_twitter_url" varchar,
  	"sizes_twitter_width" numeric,
  	"sizes_twitter_height" numeric,
  	"sizes_twitter_mime_type" varchar,
  	"sizes_twitter_filesize" numeric,
  	"sizes_twitter_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "case_study_media_locales" (
  	"caption" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric NOT NULL,
  	"project_status" "enum_projects_project_status",
  	"location_latitude" varchar,
  	"location_longitude" varchar,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"location_city" varchar NOT NULL,
  	"location_province" varchar,
  	"location_country" varchar NOT NULL,
  	"location_district" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"project_type_id" integer
  );
  
  CREATE TABLE "project_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"placeholder" varchar,
  	"prefix" varchar DEFAULT 'chegall-cms/projects/',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar,
  	"sizes_twitter_url" varchar,
  	"sizes_twitter_width" numeric,
  	"sizes_twitter_height" numeric,
  	"sizes_twitter_mime_type" varchar,
  	"sizes_twitter_filesize" numeric,
  	"sizes_twitter_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "project_media_locales" (
  	"caption" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "project_type_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "project_type" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "project_type_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "team_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"placeholder" varchar,
  	"prefix" varchar DEFAULT 'chegall-cms/team',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "team_media_locales" (
  	"caption" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "team_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"skill" varchar
  );
  
  CREATE TABLE "team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"org_roles" "enum_team_org_roles",
  	"role" varchar NOT NULL,
  	"profile_picture_id" integer NOT NULL,
  	"bio" jsonb,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_twitter" varchar,
  	"contact_info_linkedin" varchar,
  	"contact_info_instagram" varchar,
  	"contact_info_website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "chegall_inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"read" boolean DEFAULT false,
  	"type" "enum_chegall_inquiries_type" NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"company" varchar,
  	"message" varchar,
  	"source" "enum_chegall_inquiries_source",
  	"inquiry_type" "enum_chegall_inquiries_inquiry_type",
  	"investment_range" "enum_chegall_inquiries_investment_range",
  	"investment_timeline" "enum_chegall_inquiries_investment_timeline",
  	"investment_interests_residential" boolean,
  	"investment_interests_commercial" boolean,
  	"investment_interests_industrial" boolean,
  	"investment_interests_land" boolean,
  	"investor_message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "landing_banner" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"active" boolean DEFAULT false,
  	"link_u_r_l" varchar DEFAULT '#' NOT NULL,
  	"campaign_schedule_campaign_start_date" timestamp(3) with time zone,
  	"campaign_schedule_campaign_end_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "landing_banner_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"cta" varchar DEFAULT 'Learn More' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "user_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "user_accounts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "verifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "admin_invitations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "people" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_categories" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "user_sessions" CASCADE;
  DROP TABLE "user_accounts" CASCADE;
  DROP TABLE "verifications" CASCADE;
  DROP TABLE "admin_invitations" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_meta_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_meta_image_id_blog_media_id_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_categories_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_users_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_meta_image_id_blog_media_id_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_categories_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_users_fk";
  
  ALTER TABLE "search" DROP CONSTRAINT "search_meta_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_user_sessions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_user_accounts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_verifications_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_admin_invitations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_people_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk";
  
  DROP INDEX "pages_meta_meta_image_idx";
  DROP INDEX "_pages_v_version_meta_version_meta_image_idx";
  DROP INDEX "posts_meta_meta_image_idx";
  DROP INDEX "posts_rels_categories_id_idx";
  DROP INDEX "posts_rels_users_id_idx";
  DROP INDEX "_posts_v_version_meta_version_meta_image_idx";
  DROP INDEX "_posts_v_rels_categories_id_idx";
  DROP INDEX "_posts_v_rels_users_id_idx";
  DROP INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx";
  DROP INDEX "media_sizes_profile_pic_sizes_profile_pic_filename_idx";
  DROP INDEX "blog_media_sizes_xlarge_sizes_xlarge_filename_idx";
  DROP INDEX "tags_name_idx";
  DROP INDEX "search_meta_meta_image_idx";
  DROP INDEX "payload_locked_documents_rels_user_sessions_id_idx";
  DROP INDEX "payload_locked_documents_rels_user_accounts_id_idx";
  DROP INDEX "payload_locked_documents_rels_verifications_id_idx";
  DROP INDEX "payload_locked_documents_rels_admin_invitations_id_idx";
  DROP INDEX "payload_locked_documents_rels_people_id_idx";
  DROP INDEX "payload_locked_documents_rels_payload_jobs_id_idx";
  DROP INDEX "categories_slug_idx";
  ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "blog_media" ALTER COLUMN "prefix" SET DEFAULT 'chegall-cms/blog';
  ALTER TABLE "categories" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "_pages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_pages_v" ADD COLUMN "published_locale" "enum__pages_v_published_locale";
  ALTER TABLE "posts_populated_authors" ADD COLUMN "twitter" varchar;
  ALTER TABLE "posts_populated_authors" ADD COLUMN "linkedin" varchar;
  ALTER TABLE "posts_populated_authors" ADD COLUMN "instagram" varchar;
  ALTER TABLE "posts_populated_authors" ADD COLUMN "website" varchar;
  ALTER TABLE "posts_populated_authors" ADD COLUMN "image_id" integer;
  ALTER TABLE "posts_rels" ADD COLUMN "blog_categories_id" integer;
  ALTER TABLE "posts_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "twitter" varchar;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "linkedin" varchar;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "instagram" varchar;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "website" varchar;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_posts_v" ADD COLUMN "published_locale" "enum__posts_v_published_locale";
  ALTER TABLE "_posts_v_rels" ADD COLUMN "blog_categories_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "media" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'chegall-cms/general-media';
  ALTER TABLE "media" ADD COLUMN "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_tablet_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_tablet_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_tablet_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_tablet_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_tablet_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_tablet_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_twitter_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_twitter_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_twitter_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_twitter_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_twitter_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_twitter_filename" varchar;
  ALTER TABLE "categories_breadcrumbs" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "categories" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "search" ADD COLUMN "description" varchar;
  ALTER TABLE "search" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "search" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "search" ADD COLUMN "authors" varchar;
  ALTER TABLE "search" ADD COLUMN "categories" varchar;
  ALTER TABLE "search" ADD COLUMN "tags" varchar;
  ALTER TABLE "search" ADD COLUMN "keywords" varchar;
  ALTER TABLE "search_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "team_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_study_type_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_study_media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "project_media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "project_type_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "chegall_inquiries_id" integer;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_user_account_id_users_id_fk" FOREIGN KEY ("user_account_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors_locales" ADD CONSTRAINT "authors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_locales" ADD CONSTRAINT "tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_keywords" ADD CONSTRAINT "posts_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_populated_authors_locales" ADD CONSTRAINT "posts_populated_authors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_populated_authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_blog_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."blog_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_keywords" ADD CONSTRAINT "_posts_v_version_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors_locales" ADD CONSTRAINT "_posts_v_version_populated_authors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_version_populated_authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_blog_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."blog_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_media_locales" ADD CONSTRAINT "blog_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_categories_breadcrumbs" ADD CONSTRAINT "blog_categories_breadcrumbs_doc_id_blog_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_categories_breadcrumbs" ADD CONSTRAINT "blog_categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_parent_id_blog_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_categories_locales" ADD CONSTRAINT "blog_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_keywords" ADD CONSTRAINT "case_studies_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_services" ADD CONSTRAINT "case_studies_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_awards" ADD CONSTRAINT "case_studies_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "feature_list" ADD CONSTRAINT "feature_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."features_by_sec"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "features_by_sec" ADD CONSTRAINT "features_by_sec_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_project_gallery" ADD CONSTRAINT "case_studies_project_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_featured_image_id_case_study_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."case_study_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_locales" ADD CONSTRAINT "case_studies_locales_meta_image_id_case_study_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."case_study_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_locales" ADD CONSTRAINT "case_studies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_case_study_type_fk" FOREIGN KEY ("case_study_type_id") REFERENCES "public"."case_study_type"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_case_study_media_fk" FOREIGN KEY ("case_study_media_id") REFERENCES "public"."case_study_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_keywords" ADD CONSTRAINT "_case_studies_v_version_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_services" ADD CONSTRAINT "_case_studies_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_awards" ADD CONSTRAINT "_case_studies_v_version_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_feature_list_v" ADD CONSTRAINT "_feature_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_features_by_sec_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_features_by_sec_v" ADD CONSTRAINT "_features_by_sec_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_project_gallery" ADD CONSTRAINT "_case_studies_v_version_project_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_featured_image_id_case_study_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."case_study_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_locales" ADD CONSTRAINT "_case_studies_v_locales_version_meta_image_id_case_study_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."case_study_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_locales" ADD CONSTRAINT "_case_studies_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_case_study_type_fk" FOREIGN KEY ("case_study_type_id") REFERENCES "public"."case_study_type"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_case_study_media_fk" FOREIGN KEY ("case_study_media_id") REFERENCES "public"."case_study_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_study_type_breadcrumbs" ADD CONSTRAINT "case_study_type_breadcrumbs_doc_id_case_study_type_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."case_study_type"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_study_type_breadcrumbs" ADD CONSTRAINT "case_study_type_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_study_type"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_study_type" ADD CONSTRAINT "case_study_type_parent_id_case_study_type_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_study_type"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_study_type_locales" ADD CONSTRAINT "case_study_type_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_study_type"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_study_media_locales" ADD CONSTRAINT "case_study_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_study_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_services" ADD CONSTRAINT "projects_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_project_type_fk" FOREIGN KEY ("project_type_id") REFERENCES "public"."project_type"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_media_locales" ADD CONSTRAINT "project_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_type_breadcrumbs" ADD CONSTRAINT "project_type_breadcrumbs_doc_id_project_type_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."project_type"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_type_breadcrumbs" ADD CONSTRAINT "project_type_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_type"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_type" ADD CONSTRAINT "project_type_parent_id_project_type_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."project_type"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_type_locales" ADD CONSTRAINT "project_type_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_type"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_media_locales" ADD CONSTRAINT "team_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_skills" ADD CONSTRAINT "team_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_profile_picture_id_team_media_id_fk" FOREIGN KEY ("profile_picture_id") REFERENCES "public"."team_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_locales" ADD CONSTRAINT "team_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_banner_locales" ADD CONSTRAINT "landing_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_banner"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE UNIQUE INDEX "users_locales_locale_parent_id_unique" ON "users_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "authors_image_idx" ON "authors" USING btree ("image_id");
  CREATE UNIQUE INDEX "authors_user_account_idx" ON "authors" USING btree ("user_account_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE UNIQUE INDEX "authors_locales_locale_parent_id_unique" ON "authors_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "tags_name_idx" ON "tags_locales" USING btree ("name","_locale");
  CREATE UNIQUE INDEX "tags_locales_locale_parent_id_unique" ON "tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_keywords_order_idx" ON "posts_keywords" USING btree ("_order");
  CREATE INDEX "posts_keywords_parent_id_idx" ON "posts_keywords" USING btree ("_parent_id");
  CREATE INDEX "posts_keywords_locale_idx" ON "posts_keywords" USING btree ("_locale");
  CREATE UNIQUE INDEX "posts_populated_authors_locales_locale_parent_id_unique" ON "posts_populated_authors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_version_keywords_order_idx" ON "_posts_v_version_keywords" USING btree ("_order");
  CREATE INDEX "_posts_v_version_keywords_parent_id_idx" ON "_posts_v_version_keywords" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_keywords_locale_idx" ON "_posts_v_version_keywords" USING btree ("_locale");
  CREATE UNIQUE INDEX "_posts_v_version_populated_authors_locales_locale_parent_id_" ON "_posts_v_version_populated_authors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "blog_media_locales_locale_parent_id_unique" ON "blog_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blog_categories_breadcrumbs_order_idx" ON "blog_categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "blog_categories_breadcrumbs_parent_id_idx" ON "blog_categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "blog_categories_breadcrumbs_locale_idx" ON "blog_categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "blog_categories_breadcrumbs_doc_idx" ON "blog_categories_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");
  CREATE INDEX "blog_categories_parent_idx" ON "blog_categories" USING btree ("parent_id");
  CREATE INDEX "blog_categories_updated_at_idx" ON "blog_categories" USING btree ("updated_at");
  CREATE INDEX "blog_categories_created_at_idx" ON "blog_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "blog_categories_locales_locale_parent_id_unique" ON "blog_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "case_studies_keywords_order_idx" ON "case_studies_keywords" USING btree ("_order");
  CREATE INDEX "case_studies_keywords_parent_id_idx" ON "case_studies_keywords" USING btree ("_parent_id");
  CREATE INDEX "case_studies_keywords_locale_idx" ON "case_studies_keywords" USING btree ("_locale");
  CREATE INDEX "case_studies_services_order_idx" ON "case_studies_services" USING btree ("_order");
  CREATE INDEX "case_studies_services_parent_id_idx" ON "case_studies_services" USING btree ("_parent_id");
  CREATE INDEX "case_studies_services_locale_idx" ON "case_studies_services" USING btree ("_locale");
  CREATE INDEX "case_studies_awards_order_idx" ON "case_studies_awards" USING btree ("_order");
  CREATE INDEX "case_studies_awards_parent_id_idx" ON "case_studies_awards" USING btree ("_parent_id");
  CREATE INDEX "case_studies_awards_locale_idx" ON "case_studies_awards" USING btree ("_locale");
  CREATE INDEX "feature_list_order_idx" ON "feature_list" USING btree ("_order");
  CREATE INDEX "feature_list_parent_id_idx" ON "feature_list" USING btree ("_parent_id");
  CREATE INDEX "features_by_sec_order_idx" ON "features_by_sec" USING btree ("_order");
  CREATE INDEX "features_by_sec_parent_id_idx" ON "features_by_sec" USING btree ("_parent_id");
  CREATE INDEX "case_studies_project_gallery_order_idx" ON "case_studies_project_gallery" USING btree ("_order");
  CREATE INDEX "case_studies_project_gallery_parent_id_idx" ON "case_studies_project_gallery" USING btree ("_parent_id");
  CREATE INDEX "case_studies_featured_image_idx" ON "case_studies" USING btree ("featured_image_id");
  CREATE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE INDEX "case_studies_meta_meta_image_idx" ON "case_studies_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "case_studies_locales_locale_parent_id_unique" ON "case_studies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "case_studies_rels_order_idx" ON "case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_case_study_type_id_idx" ON "case_studies_rels" USING btree ("case_study_type_id");
  CREATE INDEX "case_studies_rels_team_id_idx" ON "case_studies_rels" USING btree ("team_id");
  CREATE INDEX "case_studies_rels_case_study_media_id_idx" ON "case_studies_rels" USING btree ("case_study_media_id");
  CREATE INDEX "_case_studies_v_version_keywords_order_idx" ON "_case_studies_v_version_keywords" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_keywords_parent_id_idx" ON "_case_studies_v_version_keywords" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_keywords_locale_idx" ON "_case_studies_v_version_keywords" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_version_services_order_idx" ON "_case_studies_v_version_services" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_services_parent_id_idx" ON "_case_studies_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_services_locale_idx" ON "_case_studies_v_version_services" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_version_awards_order_idx" ON "_case_studies_v_version_awards" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_awards_parent_id_idx" ON "_case_studies_v_version_awards" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_awards_locale_idx" ON "_case_studies_v_version_awards" USING btree ("_locale");
  CREATE INDEX "_feature_list_v_order_idx" ON "_feature_list_v" USING btree ("_order");
  CREATE INDEX "_feature_list_v_parent_id_idx" ON "_feature_list_v" USING btree ("_parent_id");
  CREATE INDEX "_features_by_sec_v_order_idx" ON "_features_by_sec_v" USING btree ("_order");
  CREATE INDEX "_features_by_sec_v_parent_id_idx" ON "_features_by_sec_v" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_project_gallery_order_idx" ON "_case_studies_v_version_project_gallery" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_project_gallery_parent_id_idx" ON "_case_studies_v_version_project_gallery" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_featured_image_idx" ON "_case_studies_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_snapshot_idx" ON "_case_studies_v" USING btree ("snapshot");
  CREATE INDEX "_case_studies_v_published_locale_idx" ON "_case_studies_v" USING btree ("published_locale");
  CREATE INDEX "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE INDEX "_case_studies_v_autosave_idx" ON "_case_studies_v" USING btree ("autosave");
  CREATE INDEX "_case_studies_v_version_meta_version_meta_image_idx" ON "_case_studies_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_case_studies_v_locales_locale_parent_id_unique" ON "_case_studies_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_case_studies_v_rels_order_idx" ON "_case_studies_v_rels" USING btree ("order");
  CREATE INDEX "_case_studies_v_rels_parent_idx" ON "_case_studies_v_rels" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_rels_path_idx" ON "_case_studies_v_rels" USING btree ("path");
  CREATE INDEX "_case_studies_v_rels_case_study_type_id_idx" ON "_case_studies_v_rels" USING btree ("case_study_type_id");
  CREATE INDEX "_case_studies_v_rels_team_id_idx" ON "_case_studies_v_rels" USING btree ("team_id");
  CREATE INDEX "_case_studies_v_rels_case_study_media_id_idx" ON "_case_studies_v_rels" USING btree ("case_study_media_id");
  CREATE INDEX "case_study_type_breadcrumbs_order_idx" ON "case_study_type_breadcrumbs" USING btree ("_order");
  CREATE INDEX "case_study_type_breadcrumbs_parent_id_idx" ON "case_study_type_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "case_study_type_breadcrumbs_locale_idx" ON "case_study_type_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "case_study_type_breadcrumbs_doc_idx" ON "case_study_type_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "case_study_type_slug_idx" ON "case_study_type" USING btree ("slug");
  CREATE INDEX "case_study_type_parent_idx" ON "case_study_type" USING btree ("parent_id");
  CREATE INDEX "case_study_type_updated_at_idx" ON "case_study_type" USING btree ("updated_at");
  CREATE INDEX "case_study_type_created_at_idx" ON "case_study_type" USING btree ("created_at");
  CREATE UNIQUE INDEX "case_study_type_locales_locale_parent_id_unique" ON "case_study_type_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "case_study_media_updated_at_idx" ON "case_study_media" USING btree ("updated_at");
  CREATE INDEX "case_study_media_created_at_idx" ON "case_study_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "case_study_media_filename_idx" ON "case_study_media" USING btree ("filename");
  CREATE INDEX "case_study_media_sizes_thumbnail_sizes_thumbnail_filenam_idx" ON "case_study_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "case_study_media_sizes_small_sizes_small_filename_idx" ON "case_study_media" USING btree ("sizes_small_filename");
  CREATE INDEX "case_study_media_sizes_card_sizes_card_filename_idx" ON "case_study_media" USING btree ("sizes_card_filename");
  CREATE INDEX "case_study_media_sizes_medium_sizes_medium_filename_idx" ON "case_study_media" USING btree ("sizes_medium_filename");
  CREATE INDEX "case_study_media_sizes_square_sizes_square_filename_idx" ON "case_study_media" USING btree ("sizes_square_filename");
  CREATE INDEX "case_study_media_sizes_tablet_sizes_tablet_filename_idx" ON "case_study_media" USING btree ("sizes_tablet_filename");
  CREATE INDEX "case_study_media_sizes_og_sizes_og_filename_idx" ON "case_study_media" USING btree ("sizes_og_filename");
  CREATE INDEX "case_study_media_sizes_twitter_sizes_twitter_filename_idx" ON "case_study_media" USING btree ("sizes_twitter_filename");
  CREATE INDEX "case_study_media_sizes_large_sizes_large_filename_idx" ON "case_study_media" USING btree ("sizes_large_filename");
  CREATE UNIQUE INDEX "case_study_media_locales_locale_parent_id_unique" ON "case_study_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_services_order_idx" ON "projects_services" USING btree ("_order");
  CREATE INDEX "projects_services_parent_id_idx" ON "projects_services" USING btree ("_parent_id");
  CREATE INDEX "projects_services_locale_idx" ON "projects_services" USING btree ("_locale");
  CREATE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_project_type_id_idx" ON "projects_rels" USING btree ("project_type_id");
  CREATE INDEX "project_media_updated_at_idx" ON "project_media" USING btree ("updated_at");
  CREATE INDEX "project_media_created_at_idx" ON "project_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "project_media_filename_idx" ON "project_media" USING btree ("filename");
  CREATE INDEX "project_media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "project_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "project_media_sizes_small_sizes_small_filename_idx" ON "project_media" USING btree ("sizes_small_filename");
  CREATE INDEX "project_media_sizes_card_sizes_card_filename_idx" ON "project_media" USING btree ("sizes_card_filename");
  CREATE INDEX "project_media_sizes_medium_sizes_medium_filename_idx" ON "project_media" USING btree ("sizes_medium_filename");
  CREATE INDEX "project_media_sizes_square_sizes_square_filename_idx" ON "project_media" USING btree ("sizes_square_filename");
  CREATE INDEX "project_media_sizes_tablet_sizes_tablet_filename_idx" ON "project_media" USING btree ("sizes_tablet_filename");
  CREATE INDEX "project_media_sizes_og_sizes_og_filename_idx" ON "project_media" USING btree ("sizes_og_filename");
  CREATE INDEX "project_media_sizes_twitter_sizes_twitter_filename_idx" ON "project_media" USING btree ("sizes_twitter_filename");
  CREATE INDEX "project_media_sizes_large_sizes_large_filename_idx" ON "project_media" USING btree ("sizes_large_filename");
  CREATE UNIQUE INDEX "project_media_locales_locale_parent_id_unique" ON "project_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "project_type_breadcrumbs_order_idx" ON "project_type_breadcrumbs" USING btree ("_order");
  CREATE INDEX "project_type_breadcrumbs_parent_id_idx" ON "project_type_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "project_type_breadcrumbs_locale_idx" ON "project_type_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "project_type_breadcrumbs_doc_idx" ON "project_type_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "project_type_slug_idx" ON "project_type" USING btree ("slug");
  CREATE INDEX "project_type_parent_idx" ON "project_type" USING btree ("parent_id");
  CREATE INDEX "project_type_updated_at_idx" ON "project_type" USING btree ("updated_at");
  CREATE INDEX "project_type_created_at_idx" ON "project_type" USING btree ("created_at");
  CREATE UNIQUE INDEX "project_type_locales_locale_parent_id_unique" ON "project_type_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "team_media_updated_at_idx" ON "team_media" USING btree ("updated_at");
  CREATE INDEX "team_media_created_at_idx" ON "team_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "team_media_filename_idx" ON "team_media" USING btree ("filename");
  CREATE INDEX "team_media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "team_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "team_media_sizes_card_sizes_card_filename_idx" ON "team_media" USING btree ("sizes_card_filename");
  CREATE INDEX "team_media_sizes_square_sizes_square_filename_idx" ON "team_media" USING btree ("sizes_square_filename");
  CREATE INDEX "team_media_sizes_large_sizes_large_filename_idx" ON "team_media" USING btree ("sizes_large_filename");
  CREATE UNIQUE INDEX "team_media_locales_locale_parent_id_unique" ON "team_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "team_skills_order_idx" ON "team_skills" USING btree ("_order");
  CREATE INDEX "team_skills_parent_id_idx" ON "team_skills" USING btree ("_parent_id");
  CREATE INDEX "team_skills_locale_idx" ON "team_skills" USING btree ("_locale");
  CREATE INDEX "team_profile_picture_idx" ON "team" USING btree ("profile_picture_id");
  CREATE INDEX "team_updated_at_idx" ON "team" USING btree ("updated_at");
  CREATE INDEX "team_created_at_idx" ON "team" USING btree ("created_at");
  CREATE UNIQUE INDEX "team_slug_idx" ON "team_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "team_locales_locale_parent_id_unique" ON "team_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "chegall_inquiries_updated_at_idx" ON "chegall_inquiries" USING btree ("updated_at");
  CREATE INDEX "chegall_inquiries_created_at_idx" ON "chegall_inquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE UNIQUE INDEX "landing_banner_locales_locale_parent_id_unique" ON "landing_banner_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_hero_image_id_blog_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."blog_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_study_type_fk" FOREIGN KEY ("case_study_type_id") REFERENCES "public"."case_study_type"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_study_media_fk" FOREIGN KEY ("case_study_media_id") REFERENCES "public"."case_study_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_media_fk" FOREIGN KEY ("project_media_id") REFERENCES "public"."project_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_type_fk" FOREIGN KEY ("project_type_id") REFERENCES "public"."project_type"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_media_fk" FOREIGN KEY ("team_media_id") REFERENCES "public"."team_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chegall_inquiries_fk" FOREIGN KEY ("chegall_inquiries_id") REFERENCES "public"."chegall_inquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "posts_populated_authors_image_idx" ON "posts_populated_authors" USING btree ("image_id");
  CREATE INDEX "posts_rels_blog_categories_id_idx" ON "posts_rels" USING btree ("blog_categories_id");
  CREATE INDEX "posts_rels_authors_id_idx" ON "posts_rels" USING btree ("authors_id");
  CREATE INDEX "_posts_v_version_populated_authors_image_idx" ON "_posts_v_version_populated_authors" USING btree ("image_id");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_rels_blog_categories_id_idx" ON "_posts_v_rels" USING btree ("blog_categories_id");
  CREATE INDEX "_posts_v_rels_authors_id_idx" ON "_posts_v_rels" USING btree ("authors_id");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE INDEX "media_sizes_twitter_sizes_twitter_filename_idx" ON "media" USING btree ("sizes_twitter_filename");
  CREATE INDEX "categories_breadcrumbs_locale_idx" ON "categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "search_description_idx" ON "search" USING btree ("description");
  CREATE INDEX "search_hero_image_idx" ON "search" USING btree ("hero_image_id");
  CREATE INDEX "search_subtitle_idx" ON "search" USING btree ("subtitle");
  CREATE INDEX "search_authors_idx" ON "search" USING btree ("authors");
  CREATE INDEX "search_categories_idx" ON "search" USING btree ("categories");
  CREATE INDEX "search_tags_idx" ON "search" USING btree ("tags");
  CREATE INDEX "search_keywords_idx" ON "search" USING btree ("keywords");
  CREATE INDEX "search_rels_projects_id_idx" ON "search_rels" USING btree ("projects_id");
  CREATE INDEX "search_rels_case_studies_id_idx" ON "search_rels" USING btree ("case_studies_id");
  CREATE INDEX "search_rels_team_id_idx" ON "search_rels" USING btree ("team_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_case_study_type_id_idx" ON "payload_locked_documents_rels" USING btree ("case_study_type_id");
  CREATE INDEX "payload_locked_documents_rels_case_study_media_id_idx" ON "payload_locked_documents_rels" USING btree ("case_study_media_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_project_media_id_idx" ON "payload_locked_documents_rels" USING btree ("project_media_id");
  CREATE INDEX "payload_locked_documents_rels_project_type_id_idx" ON "payload_locked_documents_rels" USING btree ("project_type_id");
  CREATE INDEX "payload_locked_documents_rels_team_media_id_idx" ON "payload_locked_documents_rels" USING btree ("team_media_id");
  CREATE INDEX "payload_locked_documents_rels_team_id_idx" ON "payload_locked_documents_rels" USING btree ("team_id");
  CREATE INDEX "payload_locked_documents_rels_chegall_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("chegall_inquiries_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "users" DROP COLUMN "email_verified";
  ALTER TABLE "users" DROP COLUMN "image";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "users" DROP COLUMN "banned";
  ALTER TABLE "users" DROP COLUMN "ban_reason";
  ALTER TABLE "users" DROP COLUMN "ban_expires";
  ALTER TABLE "pages" DROP COLUMN "meta_title";
  ALTER TABLE "pages" DROP COLUMN "meta_image_id";
  ALTER TABLE "pages" DROP COLUMN "meta_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "posts_populated_authors" DROP COLUMN "name";
  ALTER TABLE "posts" DROP COLUMN "title";
  ALTER TABLE "posts" DROP COLUMN "subtitle";
  ALTER TABLE "posts" DROP COLUMN "content";
  ALTER TABLE "posts" DROP COLUMN "meta_title";
  ALTER TABLE "posts" DROP COLUMN "meta_image_id";
  ALTER TABLE "posts" DROP COLUMN "meta_description";
  ALTER TABLE "posts_rels" DROP COLUMN "categories_id";
  ALTER TABLE "posts_rels" DROP COLUMN "users_id";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "name";
  ALTER TABLE "_posts_v" DROP COLUMN "version_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_subtitle";
  ALTER TABLE "_posts_v" DROP COLUMN "version_content";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "users_id";
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_url";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_width";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_height";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_profile_pic_url";
  ALTER TABLE "media" DROP COLUMN "sizes_profile_pic_width";
  ALTER TABLE "media" DROP COLUMN "sizes_profile_pic_height";
  ALTER TABLE "media" DROP COLUMN "sizes_profile_pic_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_profile_pic_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_profile_pic_filename";
  ALTER TABLE "blog_media" DROP COLUMN "custom_folder_path";
  ALTER TABLE "blog_media" DROP COLUMN "caption";
  ALTER TABLE "blog_media" DROP COLUMN "sizes_xlarge_url";
  ALTER TABLE "blog_media" DROP COLUMN "sizes_xlarge_width";
  ALTER TABLE "blog_media" DROP COLUMN "sizes_xlarge_height";
  ALTER TABLE "blog_media" DROP COLUMN "sizes_xlarge_mime_type";
  ALTER TABLE "blog_media" DROP COLUMN "sizes_xlarge_filesize";
  ALTER TABLE "blog_media" DROP COLUMN "sizes_xlarge_filename";
  ALTER TABLE "categories" DROP COLUMN "slug_lock";
  ALTER TABLE "tags" DROP COLUMN "name";
  ALTER TABLE "forms_blocks_checkbox" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_country" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_email" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_message" DROP COLUMN "message";
  ALTER TABLE "forms_blocks_number" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select_options" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "default_value";
  ALTER TABLE "forms_blocks_state" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "default_value";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "default_value";
  ALTER TABLE "forms_emails" DROP COLUMN "subject";
  ALTER TABLE "forms_emails" DROP COLUMN "message";
  ALTER TABLE "forms" DROP COLUMN "submit_button_label";
  ALTER TABLE "forms" DROP COLUMN "confirmation_message";
  ALTER TABLE "search" DROP COLUMN "title";
  ALTER TABLE "search" DROP COLUMN "meta_title";
  ALTER TABLE "search" DROP COLUMN "meta_description";
  ALTER TABLE "search" DROP COLUMN "meta_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "user_sessions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "user_accounts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "verifications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "admin_invitations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "people_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_jobs_id";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_admin_invitations_role";
  DROP TYPE "public"."enum_people_role";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'user');
  CREATE TYPE "public"."enum_admin_invitations_role" AS ENUM('admin', 'user');
  CREATE TYPE "public"."enum_people_role" AS ENUM('user', 'admin');
  CREATE TABLE "user_sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"token" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"ip_address" varchar,
  	"user_agent" varchar,
  	"user_id" integer NOT NULL,
  	"impersonated_by_id" integer
  );
  
  CREATE TABLE "user_accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"account_id" varchar NOT NULL,
  	"provider_id" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"access_token" varchar,
  	"refresh_token" varchar,
  	"id_token" varchar,
  	"access_token_expires_at" timestamp(3) with time zone,
  	"refresh_token_expires_at" timestamp(3) with time zone,
  	"scope" varchar,
  	"password" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "verifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"identifier" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "admin_invitations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_admin_invitations_role" DEFAULT 'admin' NOT NULL,
  	"token" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"role" "enum_people_role" DEFAULT 'user',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  ALTER TABLE "users_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tags_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_populated_authors_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_populated_authors_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_categories_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "feature_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "features_by_sec" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_project_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_feature_list_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_features_by_sec_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_project_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_study_type_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_study_type" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_study_type_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_study_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_study_media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_type_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_type" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_type_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_skills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chegall_inquiries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_country_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_state_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "landing_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "landing_banner_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_locales" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "authors_locales" CASCADE;
  DROP TABLE "tags_locales" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "posts_keywords" CASCADE;
  DROP TABLE "posts_populated_authors_locales" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v_version_keywords" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors_locales" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "blog_media_locales" CASCADE;
  DROP TABLE "blog_categories_breadcrumbs" CASCADE;
  DROP TABLE "blog_categories" CASCADE;
  DROP TABLE "blog_categories_locales" CASCADE;
  DROP TABLE "case_studies_keywords" CASCADE;
  DROP TABLE "case_studies_services" CASCADE;
  DROP TABLE "case_studies_awards" CASCADE;
  DROP TABLE "feature_list" CASCADE;
  DROP TABLE "features_by_sec" CASCADE;
  DROP TABLE "case_studies_project_gallery" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_locales" CASCADE;
  DROP TABLE "case_studies_rels" CASCADE;
  DROP TABLE "_case_studies_v_version_keywords" CASCADE;
  DROP TABLE "_case_studies_v_version_services" CASCADE;
  DROP TABLE "_case_studies_v_version_awards" CASCADE;
  DROP TABLE "_feature_list_v" CASCADE;
  DROP TABLE "_features_by_sec_v" CASCADE;
  DROP TABLE "_case_studies_v_version_project_gallery" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "_case_studies_v_locales" CASCADE;
  DROP TABLE "_case_studies_v_rels" CASCADE;
  DROP TABLE "case_study_type_breadcrumbs" CASCADE;
  DROP TABLE "case_study_type" CASCADE;
  DROP TABLE "case_study_type_locales" CASCADE;
  DROP TABLE "case_study_media" CASCADE;
  DROP TABLE "case_study_media_locales" CASCADE;
  DROP TABLE "projects_services" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "project_media" CASCADE;
  DROP TABLE "project_media_locales" CASCADE;
  DROP TABLE "project_type_breadcrumbs" CASCADE;
  DROP TABLE "project_type" CASCADE;
  DROP TABLE "project_type_locales" CASCADE;
  DROP TABLE "team_media" CASCADE;
  DROP TABLE "team_media_locales" CASCADE;
  DROP TABLE "team_skills" CASCADE;
  DROP TABLE "team" CASCADE;
  DROP TABLE "team_locales" CASCADE;
  DROP TABLE "chegall_inquiries" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "landing_banner" CASCADE;
  DROP TABLE "landing_banner_locales" CASCADE;
  ALTER TABLE "posts_populated_authors" DROP CONSTRAINT "posts_populated_authors_image_id_media_id_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_blog_categories_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_authors_fk";
  
  ALTER TABLE "_posts_v_version_populated_authors" DROP CONSTRAINT "_posts_v_version_populated_authors_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_blog_categories_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_authors_fk";
  
  ALTER TABLE "search" DROP CONSTRAINT "search_hero_image_id_blog_media_id_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_projects_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_case_studies_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_team_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_authors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_case_studies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_case_study_type_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_case_study_media_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_project_media_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_project_type_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_media_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_chegall_inquiries_fk";
  
  DROP INDEX "_pages_v_snapshot_idx";
  DROP INDEX "_pages_v_published_locale_idx";
  DROP INDEX "posts_populated_authors_image_idx";
  DROP INDEX "posts_rels_blog_categories_id_idx";
  DROP INDEX "posts_rels_authors_id_idx";
  DROP INDEX "_posts_v_version_populated_authors_image_idx";
  DROP INDEX "_posts_v_snapshot_idx";
  DROP INDEX "_posts_v_published_locale_idx";
  DROP INDEX "_posts_v_rels_blog_categories_id_idx";
  DROP INDEX "_posts_v_rels_authors_id_idx";
  DROP INDEX "categories_breadcrumbs_locale_idx";
  DROP INDEX "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX "media_sizes_tablet_sizes_tablet_filename_idx";
  DROP INDEX "media_sizes_twitter_sizes_twitter_filename_idx";
  DROP INDEX "search_description_idx";
  DROP INDEX "search_hero_image_idx";
  DROP INDEX "search_subtitle_idx";
  DROP INDEX "search_authors_idx";
  DROP INDEX "search_categories_idx";
  DROP INDEX "search_tags_idx";
  DROP INDEX "search_keywords_idx";
  DROP INDEX "search_rels_projects_id_idx";
  DROP INDEX "search_rels_case_studies_id_idx";
  DROP INDEX "search_rels_team_id_idx";
  DROP INDEX "payload_locked_documents_rels_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_authors_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_case_studies_id_idx";
  DROP INDEX "payload_locked_documents_rels_case_study_type_id_idx";
  DROP INDEX "payload_locked_documents_rels_case_study_media_id_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_project_media_id_idx";
  DROP INDEX "payload_locked_documents_rels_project_type_id_idx";
  DROP INDEX "payload_locked_documents_rels_team_media_id_idx";
  DROP INDEX "payload_locked_documents_rels_team_id_idx";
  DROP INDEX "payload_locked_documents_rels_chegall_inquiries_id_idx";
  DROP INDEX "categories_slug_idx";
  ALTER TABLE "categories" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "media" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "blog_media" ALTER COLUMN "prefix" SET DEFAULT 'blog-media';
  ALTER TABLE "users" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "users" ADD COLUMN "email_verified" boolean NOT NULL;
  ALTER TABLE "users" ADD COLUMN "image" varchar;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'user';
  ALTER TABLE "users" ADD COLUMN "banned" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "ban_reason" varchar;
  ALTER TABLE "users" ADD COLUMN "ban_expires" timestamp(3) with time zone;
  ALTER TABLE "tags" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "posts_populated_authors" ADD COLUMN "name" varchar;
  ALTER TABLE "posts" ADD COLUMN "title" varchar;
  ALTER TABLE "posts" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "posts" ADD COLUMN "content" jsonb;
  ALTER TABLE "posts" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "posts" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "posts_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "posts_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "name" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_subtitle" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "categories" ADD COLUMN "slug_lock" boolean DEFAULT true;
  ALTER TABLE "media" ADD COLUMN "caption" jsonb;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_profile_pic_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_profile_pic_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_profile_pic_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_profile_pic_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_profile_pic_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_profile_pic_filename" varchar;
  ALTER TABLE "blog_media" ADD COLUMN "custom_folder_path" varchar;
  ALTER TABLE "blog_media" ADD COLUMN "caption" jsonb;
  ALTER TABLE "blog_media" ADD COLUMN "sizes_xlarge_url" varchar;
  ALTER TABLE "blog_media" ADD COLUMN "sizes_xlarge_width" numeric;
  ALTER TABLE "blog_media" ADD COLUMN "sizes_xlarge_height" numeric;
  ALTER TABLE "blog_media" ADD COLUMN "sizes_xlarge_mime_type" varchar;
  ALTER TABLE "blog_media" ADD COLUMN "sizes_xlarge_filesize" numeric;
  ALTER TABLE "blog_media" ADD COLUMN "sizes_xlarge_filename" varchar;
  ALTER TABLE "forms_blocks_checkbox" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_country" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_email" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_message" ADD COLUMN "message" jsonb;
  ALTER TABLE "forms_blocks_number" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_select_options" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_blocks_state" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_emails" ADD COLUMN "subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL;
  ALTER TABLE "forms_emails" ADD COLUMN "message" jsonb;
  ALTER TABLE "forms" ADD COLUMN "submit_button_label" varchar;
  ALTER TABLE "forms" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "search" ADD COLUMN "title" varchar;
  ALTER TABLE "search" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "search" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "search" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "user_sessions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "user_accounts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "verifications_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "admin_invitations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "people_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_jobs_id" integer;
  ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_impersonated_by_id_users_id_fk" FOREIGN KEY ("impersonated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "user_sessions_token_idx" ON "user_sessions" USING btree ("token");
  CREATE INDEX "user_sessions_created_at_idx" ON "user_sessions" USING btree ("created_at");
  CREATE INDEX "user_sessions_updated_at_idx" ON "user_sessions" USING btree ("updated_at");
  CREATE INDEX "user_sessions_user_idx" ON "user_sessions" USING btree ("user_id");
  CREATE INDEX "user_sessions_impersonated_by_idx" ON "user_sessions" USING btree ("impersonated_by_id");
  CREATE INDEX "user_accounts_account_id_idx" ON "user_accounts" USING btree ("account_id");
  CREATE INDEX "user_accounts_user_idx" ON "user_accounts" USING btree ("user_id");
  CREATE INDEX "user_accounts_access_token_expires_at_idx" ON "user_accounts" USING btree ("access_token_expires_at");
  CREATE INDEX "user_accounts_refresh_token_expires_at_idx" ON "user_accounts" USING btree ("refresh_token_expires_at");
  CREATE INDEX "user_accounts_created_at_idx" ON "user_accounts" USING btree ("created_at");
  CREATE INDEX "user_accounts_updated_at_idx" ON "user_accounts" USING btree ("updated_at");
  CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");
  CREATE INDEX "verifications_expires_at_idx" ON "verifications" USING btree ("expires_at");
  CREATE INDEX "verifications_created_at_idx" ON "verifications" USING btree ("created_at");
  CREATE INDEX "verifications_updated_at_idx" ON "verifications" USING btree ("updated_at");
  CREATE INDEX "admin_invitations_token_idx" ON "admin_invitations" USING btree ("token");
  CREATE INDEX "admin_invitations_updated_at_idx" ON "admin_invitations" USING btree ("updated_at");
  CREATE INDEX "admin_invitations_created_at_idx" ON "admin_invitations" USING btree ("created_at");
  CREATE UNIQUE INDEX "people_email_idx" ON "people" USING btree ("email");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_blog_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."blog_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_blog_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."blog_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_user_sessions_fk" FOREIGN KEY ("user_sessions_id") REFERENCES "public"."user_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_user_accounts_fk" FOREIGN KEY ("user_accounts_id") REFERENCES "public"."user_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verifications_fk" FOREIGN KEY ("verifications_id") REFERENCES "public"."verifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admin_invitations_fk" FOREIGN KEY ("admin_invitations_id") REFERENCES "public"."admin_invitations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "tags_name_idx" ON "tags" USING btree ("name");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "media_sizes_profile_pic_sizes_profile_pic_filename_idx" ON "media" USING btree ("sizes_profile_pic_filename");
  CREATE INDEX "blog_media_sizes_xlarge_sizes_xlarge_filename_idx" ON "blog_media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "payload_locked_documents_rels_user_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("user_sessions_id");
  CREATE INDEX "payload_locked_documents_rels_user_accounts_id_idx" ON "payload_locked_documents_rels" USING btree ("user_accounts_id");
  CREATE INDEX "payload_locked_documents_rels_verifications_id_idx" ON "payload_locked_documents_rels" USING btree ("verifications_id");
  CREATE INDEX "payload_locked_documents_rels_admin_invitations_id_idx" ON "payload_locked_documents_rels" USING btree ("admin_invitations_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  ALTER TABLE "_pages_v" DROP COLUMN "snapshot";
  ALTER TABLE "_pages_v" DROP COLUMN "published_locale";
  ALTER TABLE "posts_populated_authors" DROP COLUMN "twitter";
  ALTER TABLE "posts_populated_authors" DROP COLUMN "linkedin";
  ALTER TABLE "posts_populated_authors" DROP COLUMN "instagram";
  ALTER TABLE "posts_populated_authors" DROP COLUMN "website";
  ALTER TABLE "posts_populated_authors" DROP COLUMN "image_id";
  ALTER TABLE "posts_rels" DROP COLUMN "blog_categories_id";
  ALTER TABLE "posts_rels" DROP COLUMN "authors_id";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "twitter";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "linkedin";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "instagram";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "website";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "snapshot";
  ALTER TABLE "_posts_v" DROP COLUMN "published_locale";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "blog_categories_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "authors_id";
  ALTER TABLE "categories_breadcrumbs" DROP COLUMN "_locale";
  ALTER TABLE "categories" DROP COLUMN "generate_slug";
  ALTER TABLE "media" DROP COLUMN "placeholder";
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "media" DROP COLUMN "sizes_card_url";
  ALTER TABLE "media" DROP COLUMN "sizes_card_width";
  ALTER TABLE "media" DROP COLUMN "sizes_card_height";
  ALTER TABLE "media" DROP COLUMN "sizes_card_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_tablet_url";
  ALTER TABLE "media" DROP COLUMN "sizes_tablet_width";
  ALTER TABLE "media" DROP COLUMN "sizes_tablet_height";
  ALTER TABLE "media" DROP COLUMN "sizes_tablet_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_tablet_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_tablet_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_twitter_url";
  ALTER TABLE "media" DROP COLUMN "sizes_twitter_width";
  ALTER TABLE "media" DROP COLUMN "sizes_twitter_height";
  ALTER TABLE "media" DROP COLUMN "sizes_twitter_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_twitter_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_twitter_filename";
  ALTER TABLE "search" DROP COLUMN "description";
  ALTER TABLE "search" DROP COLUMN "hero_image_id";
  ALTER TABLE "search" DROP COLUMN "subtitle";
  ALTER TABLE "search" DROP COLUMN "authors";
  ALTER TABLE "search" DROP COLUMN "categories";
  ALTER TABLE "search" DROP COLUMN "tags";
  ALTER TABLE "search" DROP COLUMN "keywords";
  ALTER TABLE "search_rels" DROP COLUMN "projects_id";
  ALTER TABLE "search_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "search_rels" DROP COLUMN "team_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "authors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "case_study_type_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "case_study_media_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "project_media_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "project_type_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_media_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "chegall_inquiries_id";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_documents_category";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_feature_list_value_type";
  DROP TYPE "public"."section_type_enum";
  DROP TYPE "public"."enum_case_studies_project_status";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__feature_list_v_value_type";
  DROP TYPE "public"."enum__case_studies_v_version_project_status";
  DROP TYPE "public"."enum__case_studies_v_version_status";
  DROP TYPE "public"."enum__case_studies_v_published_locale";
  DROP TYPE "public"."enum_projects_project_status";
  DROP TYPE "public"."enum_team_org_roles";
  DROP TYPE "public"."enum_chegall_inquiries_type";
  DROP TYPE "public"."enum_chegall_inquiries_source";
  DROP TYPE "public"."enum_chegall_inquiries_inquiry_type";
  DROP TYPE "public"."enum_chegall_inquiries_investment_range";
  DROP TYPE "public"."enum_chegall_inquiries_investment_timeline";`)
}
