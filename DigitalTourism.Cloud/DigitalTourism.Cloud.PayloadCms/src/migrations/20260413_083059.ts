import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'bg', 'de', 'fr', 'ru');
  CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum_pages_hero_nav_theme" AS ENUM('transparent-light', 'transparent-dark', 'solid');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__pages_v_version_hero_nav_theme" AS ENUM('transparent-light', 'transparent-dark', 'solid');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'bg', 'de', 'fr', 'ru');
  CREATE TYPE "public"."enum_hotels_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_hotels_star_rating" AS ENUM('1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum_hotels_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__hotels_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__hotels_v_version_star_rating" AS ENUM('1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum__hotels_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__hotels_v_published_locale" AS ENUM('en', 'bg', 'de', 'fr', 'ru');
  CREATE TYPE "public"."enum_restaurants_restaurant_hours_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_restaurants_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_restaurants_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__restaurants_v_version_restaurant_hours_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum__restaurants_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__restaurants_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__restaurants_v_published_locale" AS ENUM('en', 'bg', 'de', 'fr', 'ru');
  CREATE TYPE "public"."enum_activities_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_activities_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__activities_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__activities_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__activities_v_published_locale" AS ENUM('en', 'bg', 'de', 'fr', 'ru');
  CREATE TYPE "public"."enum_attractions_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_attractions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__attractions_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__attractions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__attractions_v_published_locale" AS ENUM('en', 'bg', 'de', 'fr', 'ru');
  CREATE TYPE "public"."enum_events_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_workflow_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('en', 'bg', 'de', 'fr', 'ru');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'business-owner', 'municipal-moderator', 'tourism-curator');
  CREATE TYPE "public"."enum_users_keycloak_sync_status" AS ENUM('synced', 'pending', 'error');
  CREATE TYPE "public"."enum_visitors_language" AS ENUM('en', 'bg', 'de', 'fr', 'ru');
  CREATE TYPE "public"."enum_newsletter_subscriptions_status" AS ENUM('active', 'unsubscribed');
  CREATE TYPE "public"."enum_newsletter_subscriptions_locale" AS ENUM('en', 'bg', 'de', 'fr', 'ru');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_workflow_history_from_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_workflow_history_to_status" AS ENUM('draft', 'in_review', 'approved', 'published');
  CREATE TYPE "public"."enum_workflow_history_action" AS ENUM('submit_for_review', 'approve', 'reject', 'publish', 'unpublish', 'recall', 'save_draft');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'syncKeycloakUsers', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'syncKeycloakUsers', 'schedulePublish');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_link_groups_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('facebook', 'instagram', 'youtube');
  CREATE TYPE "public"."enum_main_menu_tabs_nav_items_list_links_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_main_menu_tabs_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_main_menu_tabs_dropdown_type" AS ENUM('directions', 'info');
  CREATE TYPE "public"."enum_settings_facet_config_facet_key" AS ENUM('type', 'categories', 'tags', 'region', 'municipality', 'city', 'starRating', 'amenities', 'cuisineType', 'dietaryOptions', 'difficultyLevel', 'seasonality', 'organizer');
  CREATE TYPE "public"."enum_settings_facet_config_selection_mode" AS ENUM('multi', 'single');
  CREATE TYPE "public"."enum_settings_facet_config_filter_mode" AS ENUM('or', 'and');
  CREATE TYPE "public"."enum_settings_newsletter_provider" AS ENUM('database', 'mailchimp', 'brevo', 'mailerlite');
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact',
  	"hero_nav_theme" "enum_pages_hero_nav_theme" DEFAULT 'transparent-light',
  	"hero_media_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"parent_id" integer,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"hero_rich_text" jsonb,
  	"hero_decorative_text" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact',
  	"version_hero_nav_theme" "enum__pages_v_version_hero_nav_theme" DEFAULT 'transparent-light',
  	"version_hero_media_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_parent_id" integer,
  	"version__translationstatus" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_hero_rich_text" jsonb,
  	"version_hero_decorative_text" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "hotels_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "hotels_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "hotels_brochures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "hotels_brochures_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "hotels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"workflow_status" "enum_hotels_workflow_status" DEFAULT 'draft',
  	"created_by_id" integer,
  	"city_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"external_id" varchar,
  	"external_source" varchar,
  	"hero_image_id" integer,
  	"location_coordinates_latitude" numeric,
  	"location_coordinates_longitude" numeric,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"contact_website" varchar,
  	"star_rating" "enum_hotels_star_rating",
  	"rooms" numeric,
  	"check_in_time" varchar,
  	"check_out_time" varchar,
  	"booking_url" varchar,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_hotels_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "hotels_locales" (
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"working_hours" jsonb,
  	"how_to_get_there" jsonb,
  	"practical_info" jsonb,
  	"info_center" jsonb,
  	"contact_info" jsonb,
  	"location_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "hotels_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer,
  	"media_id" integer,
  	"amenities_id" integer
  );
  
  CREATE TABLE "_hotels_v_version_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hotels_v_version_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_hotels_v_version_brochures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hotels_v_version_brochures_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_hotels_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_workflow_status" "enum__hotels_v_version_workflow_status" DEFAULT 'draft',
  	"version_created_by_id" integer,
  	"version_city_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_external_id" varchar,
  	"version_external_source" varchar,
  	"version_hero_image_id" integer,
  	"version_location_coordinates_latitude" numeric,
  	"version_location_coordinates_longitude" numeric,
  	"version_contact_phone" varchar,
  	"version_contact_email" varchar,
  	"version_contact_website" varchar,
  	"version_star_rating" "enum__hotels_v_version_star_rating",
  	"version_rooms" numeric,
  	"version_check_in_time" varchar,
  	"version_check_out_time" varchar,
  	"version_booking_url" varchar,
  	"version__translationstatus" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__hotels_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__hotels_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_hotels_v_locales" (
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_description" jsonb,
  	"version_working_hours" jsonb,
  	"version_how_to_get_there" jsonb,
  	"version_practical_info" jsonb,
  	"version_info_center" jsonb,
  	"version_contact_info" jsonb,
  	"version_location_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_hotels_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer,
  	"media_id" integer,
  	"amenities_id" integer
  );
  
  CREATE TABLE "restaurants_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "restaurants_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "restaurants_brochures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "restaurants_brochures_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "restaurants_restaurant_hours_days" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_restaurants_restaurant_hours_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "restaurants_restaurant_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"open_time" varchar,
  	"close_time" varchar
  );
  
  CREATE TABLE "restaurants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"workflow_status" "enum_restaurants_workflow_status" DEFAULT 'draft',
  	"created_by_id" integer,
  	"city_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"external_id" varchar,
  	"external_source" varchar,
  	"hero_image_id" integer,
  	"location_coordinates_latitude" numeric,
  	"location_coordinates_longitude" numeric,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"contact_website" varchar,
  	"menu_url" varchar,
  	"reservation_url" varchar,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_restaurants_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "restaurants_locales" (
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"working_hours" jsonb,
  	"how_to_get_there" jsonb,
  	"practical_info" jsonb,
  	"info_center" jsonb,
  	"contact_info" jsonb,
  	"location_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "restaurants_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer,
  	"media_id" integer,
  	"cuisine_types_id" integer,
  	"dietary_options_id" integer
  );
  
  CREATE TABLE "_restaurants_v_version_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_restaurants_v_version_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_restaurants_v_version_brochures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_restaurants_v_version_brochures_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_restaurants_v_version_restaurant_hours_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__restaurants_v_version_restaurant_hours_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_restaurants_v_version_restaurant_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"open_time" varchar,
  	"close_time" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_restaurants_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_workflow_status" "enum__restaurants_v_version_workflow_status" DEFAULT 'draft',
  	"version_created_by_id" integer,
  	"version_city_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_external_id" varchar,
  	"version_external_source" varchar,
  	"version_hero_image_id" integer,
  	"version_location_coordinates_latitude" numeric,
  	"version_location_coordinates_longitude" numeric,
  	"version_contact_phone" varchar,
  	"version_contact_email" varchar,
  	"version_contact_website" varchar,
  	"version_menu_url" varchar,
  	"version_reservation_url" varchar,
  	"version__translationstatus" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__restaurants_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__restaurants_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_restaurants_v_locales" (
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_description" jsonb,
  	"version_working_hours" jsonb,
  	"version_how_to_get_there" jsonb,
  	"version_practical_info" jsonb,
  	"version_info_center" jsonb,
  	"version_contact_info" jsonb,
  	"version_location_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_restaurants_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer,
  	"media_id" integer,
  	"cuisine_types_id" integer,
  	"dietary_options_id" integer
  );
  
  CREATE TABLE "activities_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "activities_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "activities_brochures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "activities_brochures_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "activities_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "activities_includes_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "activities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"workflow_status" "enum_activities_workflow_status" DEFAULT 'draft',
  	"created_by_id" integer,
  	"city_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"external_id" varchar,
  	"external_source" varchar,
  	"hero_image_id" integer,
  	"location_coordinates_latitude" numeric,
  	"location_coordinates_longitude" numeric,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"contact_website" varchar,
  	"duration" varchar,
  	"difficulty_level_id" integer,
  	"minimum_age" numeric,
  	"group_size_min" numeric,
  	"group_size_max" numeric,
  	"equipment_provided" boolean DEFAULT false,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_activities_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "activities_locales" (
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"working_hours" jsonb,
  	"how_to_get_there" jsonb,
  	"practical_info" jsonb,
  	"info_center" jsonb,
  	"contact_info" jsonb,
  	"location_address" varchar,
  	"what_to_bring" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "activities_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer,
  	"media_id" integer,
  	"seasons_id" integer
  );
  
  CREATE TABLE "_activities_v_version_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_activities_v_version_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_activities_v_version_brochures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_activities_v_version_brochures_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_activities_v_version_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_activities_v_version_includes_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_activities_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_workflow_status" "enum__activities_v_version_workflow_status" DEFAULT 'draft',
  	"version_created_by_id" integer,
  	"version_city_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_external_id" varchar,
  	"version_external_source" varchar,
  	"version_hero_image_id" integer,
  	"version_location_coordinates_latitude" numeric,
  	"version_location_coordinates_longitude" numeric,
  	"version_contact_phone" varchar,
  	"version_contact_email" varchar,
  	"version_contact_website" varchar,
  	"version_duration" varchar,
  	"version_difficulty_level_id" integer,
  	"version_minimum_age" numeric,
  	"version_group_size_min" numeric,
  	"version_group_size_max" numeric,
  	"version_equipment_provided" boolean DEFAULT false,
  	"version__translationstatus" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__activities_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__activities_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_activities_v_locales" (
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_description" jsonb,
  	"version_working_hours" jsonb,
  	"version_how_to_get_there" jsonb,
  	"version_practical_info" jsonb,
  	"version_info_center" jsonb,
  	"version_contact_info" jsonb,
  	"version_location_address" varchar,
  	"version_what_to_bring" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_activities_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer,
  	"media_id" integer,
  	"seasons_id" integer
  );
  
  CREATE TABLE "attractions_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "attractions_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "attractions_brochures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "attractions_brochures_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "attractions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"workflow_status" "enum_attractions_workflow_status" DEFAULT 'draft',
  	"created_by_id" integer,
  	"city_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"external_id" varchar,
  	"external_source" varchar,
  	"hero_image_id" integer,
  	"location_coordinates_latitude" numeric,
  	"location_coordinates_longitude" numeric,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"contact_website" varchar,
  	"visit_duration" numeric,
  	"attraction_hours" varchar,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_attractions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "attractions_locales" (
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"working_hours" jsonb,
  	"how_to_get_there" jsonb,
  	"practical_info" jsonb,
  	"info_center" jsonb,
  	"contact_info" jsonb,
  	"location_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "attractions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_attractions_v_version_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_attractions_v_version_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_attractions_v_version_brochures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_attractions_v_version_brochures_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_attractions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_workflow_status" "enum__attractions_v_version_workflow_status" DEFAULT 'draft',
  	"version_created_by_id" integer,
  	"version_city_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_external_id" varchar,
  	"version_external_source" varchar,
  	"version_hero_image_id" integer,
  	"version_location_coordinates_latitude" numeric,
  	"version_location_coordinates_longitude" numeric,
  	"version_contact_phone" varchar,
  	"version_contact_email" varchar,
  	"version_contact_website" varchar,
  	"version_visit_duration" numeric,
  	"version_attraction_hours" varchar,
  	"version__translationstatus" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__attractions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__attractions_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_attractions_v_locales" (
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_description" jsonb,
  	"version_working_hours" jsonb,
  	"version_how_to_get_there" jsonb,
  	"version_practical_info" jsonb,
  	"version_info_center" jsonb,
  	"version_contact_info" jsonb,
  	"version_location_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_attractions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "events_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "events_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "events_brochures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "events_brochures_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"workflow_status" "enum_events_workflow_status" DEFAULT 'draft',
  	"created_by_id" integer,
  	"city_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"external_id" varchar,
  	"external_source" varchar,
  	"hero_image_id" integer,
  	"location_coordinates_latitude" numeric,
  	"location_coordinates_longitude" numeric,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"contact_website" varchar,
  	"period_start_date" timestamp(3) with time zone,
  	"period_end_date" timestamp(3) with time zone,
  	"all_day" boolean DEFAULT false,
  	"organizer" varchar,
  	"registration_url" varchar,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_locales" (
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"working_hours" jsonb,
  	"how_to_get_there" jsonb,
  	"practical_info" jsonb,
  	"info_center" jsonb,
  	"contact_info" jsonb,
  	"location_address" varchar,
  	"subtitle" varchar,
  	"duration" varchar,
  	"ticket_price_label" varchar,
  	"organizer_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_events_v_version_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v_version_brochures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_brochures_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_workflow_status" "enum__events_v_version_workflow_status" DEFAULT 'draft',
  	"version_created_by_id" integer,
  	"version_city_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_external_id" varchar,
  	"version_external_source" varchar,
  	"version_hero_image_id" integer,
  	"version_location_coordinates_latitude" numeric,
  	"version_location_coordinates_longitude" numeric,
  	"version_contact_phone" varchar,
  	"version_contact_email" varchar,
  	"version_contact_website" varchar,
  	"version_period_start_date" timestamp(3) with time zone,
  	"version_period_end_date" timestamp(3) with time zone,
  	"version_all_day" boolean DEFAULT false,
  	"version_organizer" varchar,
  	"version_registration_url" varchar,
  	"version__translationstatus" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__events_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_locales" (
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_description" jsonb,
  	"version_working_hours" jsonb,
  	"version_how_to_get_there" jsonb,
  	"version_practical_info" jsonb,
  	"version_info_center" jsonb,
  	"version_contact_info" jsonb,
  	"version_location_address" varchar,
  	"version_subtitle" varchar,
  	"version_duration" varchar,
  	"version_ticket_price_label" varchar,
  	"version_organizer_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"created_by_id" integer,
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
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"caption" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"parent_id" integer,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags_locales" (
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"ekatte_code" varchar,
  	"hero_image_id" integer,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "regions_locales" (
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "municipalities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"region_id" integer NOT NULL,
  	"ekatte_code" varchar,
  	"hero_image_id" integer,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "municipalities_locales" (
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"municipality_id" integer NOT NULL,
  	"ekatte_code" varchar,
  	"population" numeric,
  	"is_capital" boolean DEFAULT false,
  	"coordinates_latitude" numeric,
  	"coordinates_longitude" numeric,
  	"hero_image_id" integer,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cities_locales" (
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_title" varchar,
  	"first_name" varchar,
  	"last_name" varchar,
  	"email" varchar NOT NULL,
  	"keycloak_id" varchar,
  	"assigned_municipality_id" integer,
  	"last_login" timestamp(3) with time zone,
  	"is_active" boolean DEFAULT true,
  	"keycloak_sync_status" "enum_users_keycloak_sync_status",
  	"keycloak_synced_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "visitors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"email" varchar NOT NULL,
  	"keycloak_id" varchar NOT NULL,
  	"language" "enum_visitors_language" DEFAULT 'en',
  	"preferences_notifications_email" boolean DEFAULT true,
  	"preferences_notifications_push" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "visitors_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "favorites" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visitor_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "favorites_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "trips_days_stops" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"visited" boolean DEFAULT false
  );
  
  CREATE TABLE "trips_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_number" numeric
  );
  
  CREATE TABLE "trips_pool" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "trips" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"visitor_id" integer NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"duration" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "trips_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "newsletter_subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"status" "enum_newsletter_subscriptions_status" DEFAULT 'active' NOT NULL,
  	"locale" "enum_newsletter_subscriptions_locale" DEFAULT 'en',
  	"source" varchar DEFAULT 'footer',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "amenities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"icon_name" varchar,
  	"svg_content" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "amenities_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cuisine_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"icon_name" varchar,
  	"svg_content" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cuisine_types_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "dietary_options" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"icon_name" varchar,
  	"svg_content" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "dietary_options_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "seasons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"icon_name" varchar,
  	"svg_content" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "seasons_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "difficulty_levels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"icon_name" varchar,
  	"svg_content" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "difficulty_levels_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"_translationstatus" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "workflow_history" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection" varchar NOT NULL,
  	"document_id" varchar NOT NULL,
  	"document_title" varchar,
  	"from_status" "enum_workflow_history_from_status",
  	"to_status" "enum_workflow_history_to_status" NOT NULL,
  	"action" "enum_workflow_history_action" NOT NULL,
  	"performed_by_id" integer NOT NULL,
  	"feedback" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"concurrency_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"hotels_id" integer,
  	"restaurants_id" integer,
  	"activities_id" integer,
  	"attractions_id" integer,
  	"events_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"tags_id" integer,
  	"regions_id" integer,
  	"municipalities_id" integer,
  	"cities_id" integer,
  	"users_id" integer,
  	"visitors_id" integer,
  	"favorites_id" integer,
  	"trips_id" integer,
  	"newsletter_subscriptions_id" integer,
  	"amenities_id" integer,
  	"cuisine_types_id" integer,
  	"dietary_options_id" integer,
  	"seasons_id" integer,
  	"difficulty_levels_id" integer,
  	"redirects_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"workflow_history_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"visitors_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_nav_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_link_groups_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_link_groups_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_link_groups_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_link_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_link_groups_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_social_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_resolved" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"newsletter_headline" varchar,
  	"newsletter_subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "main_menu_tabs_nav_items_list_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_main_menu_tabs_nav_items_list_links_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "main_menu_tabs_nav_items_list_links_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "main_menu_tabs_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "main_menu_tabs_nav_items_locales" (
  	"list_links_tag" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "main_menu_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enable_direct_link" boolean,
  	"enable_dropdown" boolean,
  	"link_type" "enum_main_menu_tabs_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"dropdown_type" "enum_main_menu_tabs_dropdown_type" DEFAULT 'info'
  );
  
  CREATE TABLE "main_menu_tabs_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "main_menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_resolved" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "main_menu_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "settings_facet_config" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"facet_key" "enum_settings_facet_config_facet_key" NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"default_expanded" boolean DEFAULT false,
  	"max_visible" numeric,
  	"sort_order" numeric DEFAULT 10,
  	"selection_mode" "enum_settings_facet_config_selection_mode" DEFAULT 'multi',
  	"filter_mode" "enum_settings_facet_config_filter_mode" DEFAULT 'or'
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"placeholder" varchar,
  	"home_page_id" integer,
  	"terms_of_conditions_page_id" integer,
  	"privacy_policy_page_id" integer,
  	"business_terms_page_id" integer,
  	"map_max_city_markers" numeric DEFAULT 50,
  	"map_max_experience_markers" numeric DEFAULT 200,
  	"map_zoom_threshold" numeric DEFAULT 12,
  	"require_all_translations" boolean DEFAULT false,
  	"site_password_enabled" boolean DEFAULT false,
  	"site_password" varchar,
  	"site_password_hash" varchar,
  	"allow_crawler_indexing" boolean DEFAULT false,
  	"newsletter_provider" "enum_settings_newsletter_provider" DEFAULT 'database',
  	"mailchimp_api_key" varchar,
  	"mailchimp_audience_id" varchar,
  	"brevo_api_key" varchar,
  	"brevo_list_id" varchar,
  	"mailerlite_api_token" varchar,
  	"mailerlite_group_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings_locales" (
  	"site_name" varchar,
  	"site_tagline" varchar,
  	"default_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_links_locales" ADD CONSTRAINT "pages_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links_locales" ADD CONSTRAINT "_pages_v_version_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_videos" ADD CONSTRAINT "hotels_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_videos_locales" ADD CONSTRAINT "hotels_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hotels_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_brochures" ADD CONSTRAINT "hotels_brochures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hotels_brochures" ADD CONSTRAINT "hotels_brochures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_brochures_locales" ADD CONSTRAINT "hotels_brochures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hotels_brochures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels" ADD CONSTRAINT "hotels_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hotels" ADD CONSTRAINT "hotels_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hotels" ADD CONSTRAINT "hotels_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hotels_locales" ADD CONSTRAINT "hotels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_rels" ADD CONSTRAINT "hotels_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_rels" ADD CONSTRAINT "hotels_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_rels" ADD CONSTRAINT "hotels_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_rels" ADD CONSTRAINT "hotels_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_rels" ADD CONSTRAINT "hotels_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_rels" ADD CONSTRAINT "hotels_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_rels" ADD CONSTRAINT "hotels_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_rels" ADD CONSTRAINT "hotels_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_rels" ADD CONSTRAINT "hotels_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels_rels" ADD CONSTRAINT "hotels_rels_amenities_fk" FOREIGN KEY ("amenities_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_version_videos" ADD CONSTRAINT "_hotels_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hotels_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_version_videos_locales" ADD CONSTRAINT "_hotels_v_version_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hotels_v_version_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_version_brochures" ADD CONSTRAINT "_hotels_v_version_brochures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hotels_v_version_brochures" ADD CONSTRAINT "_hotels_v_version_brochures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hotels_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_version_brochures_locales" ADD CONSTRAINT "_hotels_v_version_brochures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hotels_v_version_brochures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v" ADD CONSTRAINT "_hotels_v_parent_id_hotels_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."hotels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hotels_v" ADD CONSTRAINT "_hotels_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hotels_v" ADD CONSTRAINT "_hotels_v_version_city_id_cities_id_fk" FOREIGN KEY ("version_city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hotels_v" ADD CONSTRAINT "_hotels_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hotels_v_locales" ADD CONSTRAINT "_hotels_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hotels_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_rels" ADD CONSTRAINT "_hotels_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_hotels_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_rels" ADD CONSTRAINT "_hotels_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_rels" ADD CONSTRAINT "_hotels_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_rels" ADD CONSTRAINT "_hotels_v_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_rels" ADD CONSTRAINT "_hotels_v_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_rels" ADD CONSTRAINT "_hotels_v_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_rels" ADD CONSTRAINT "_hotels_v_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_rels" ADD CONSTRAINT "_hotels_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_rels" ADD CONSTRAINT "_hotels_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hotels_v_rels" ADD CONSTRAINT "_hotels_v_rels_amenities_fk" FOREIGN KEY ("amenities_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_videos" ADD CONSTRAINT "restaurants_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_videos_locales" ADD CONSTRAINT "restaurants_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."restaurants_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_brochures" ADD CONSTRAINT "restaurants_brochures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "restaurants_brochures" ADD CONSTRAINT "restaurants_brochures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_brochures_locales" ADD CONSTRAINT "restaurants_brochures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."restaurants_brochures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_restaurant_hours_days" ADD CONSTRAINT "restaurants_restaurant_hours_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."restaurants_restaurant_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_restaurant_hours" ADD CONSTRAINT "restaurants_restaurant_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "restaurants_locales" ADD CONSTRAINT "restaurants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_rels" ADD CONSTRAINT "restaurants_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_rels" ADD CONSTRAINT "restaurants_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_rels" ADD CONSTRAINT "restaurants_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_rels" ADD CONSTRAINT "restaurants_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_rels" ADD CONSTRAINT "restaurants_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_rels" ADD CONSTRAINT "restaurants_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_rels" ADD CONSTRAINT "restaurants_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_rels" ADD CONSTRAINT "restaurants_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_rels" ADD CONSTRAINT "restaurants_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_rels" ADD CONSTRAINT "restaurants_rels_cuisine_types_fk" FOREIGN KEY ("cuisine_types_id") REFERENCES "public"."cuisine_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "restaurants_rels" ADD CONSTRAINT "restaurants_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_version_videos" ADD CONSTRAINT "_restaurants_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_restaurants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_version_videos_locales" ADD CONSTRAINT "_restaurants_v_version_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_restaurants_v_version_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_version_brochures" ADD CONSTRAINT "_restaurants_v_version_brochures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_restaurants_v_version_brochures" ADD CONSTRAINT "_restaurants_v_version_brochures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_restaurants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_version_brochures_locales" ADD CONSTRAINT "_restaurants_v_version_brochures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_restaurants_v_version_brochures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_version_restaurant_hours_days" ADD CONSTRAINT "_restaurants_v_version_restaurant_hours_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_restaurants_v_version_restaurant_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_version_restaurant_hours" ADD CONSTRAINT "_restaurants_v_version_restaurant_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_restaurants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v" ADD CONSTRAINT "_restaurants_v_parent_id_restaurants_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."restaurants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_restaurants_v" ADD CONSTRAINT "_restaurants_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_restaurants_v" ADD CONSTRAINT "_restaurants_v_version_city_id_cities_id_fk" FOREIGN KEY ("version_city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_restaurants_v" ADD CONSTRAINT "_restaurants_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_restaurants_v_locales" ADD CONSTRAINT "_restaurants_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_restaurants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_rels" ADD CONSTRAINT "_restaurants_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_restaurants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_rels" ADD CONSTRAINT "_restaurants_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_rels" ADD CONSTRAINT "_restaurants_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_rels" ADD CONSTRAINT "_restaurants_v_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_rels" ADD CONSTRAINT "_restaurants_v_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_rels" ADD CONSTRAINT "_restaurants_v_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_rels" ADD CONSTRAINT "_restaurants_v_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_rels" ADD CONSTRAINT "_restaurants_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_rels" ADD CONSTRAINT "_restaurants_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_rels" ADD CONSTRAINT "_restaurants_v_rels_cuisine_types_fk" FOREIGN KEY ("cuisine_types_id") REFERENCES "public"."cuisine_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_restaurants_v_rels" ADD CONSTRAINT "_restaurants_v_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_videos" ADD CONSTRAINT "activities_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_videos_locales" ADD CONSTRAINT "activities_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_brochures" ADD CONSTRAINT "activities_brochures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities_brochures" ADD CONSTRAINT "activities_brochures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_brochures_locales" ADD CONSTRAINT "activities_brochures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities_brochures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_includes" ADD CONSTRAINT "activities_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_includes_locales" ADD CONSTRAINT "activities_includes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities_includes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_difficulty_level_id_difficulty_levels_id_fk" FOREIGN KEY ("difficulty_level_id") REFERENCES "public"."difficulty_levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities_locales" ADD CONSTRAINT "activities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_rels" ADD CONSTRAINT "activities_rels_seasons_fk" FOREIGN KEY ("seasons_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_version_videos" ADD CONSTRAINT "_activities_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_activities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_version_videos_locales" ADD CONSTRAINT "_activities_v_version_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_activities_v_version_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_version_brochures" ADD CONSTRAINT "_activities_v_version_brochures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_activities_v_version_brochures" ADD CONSTRAINT "_activities_v_version_brochures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_activities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_version_brochures_locales" ADD CONSTRAINT "_activities_v_version_brochures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_activities_v_version_brochures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_version_includes" ADD CONSTRAINT "_activities_v_version_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_activities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_version_includes_locales" ADD CONSTRAINT "_activities_v_version_includes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_activities_v_version_includes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v" ADD CONSTRAINT "_activities_v_parent_id_activities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."activities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_activities_v" ADD CONSTRAINT "_activities_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_activities_v" ADD CONSTRAINT "_activities_v_version_city_id_cities_id_fk" FOREIGN KEY ("version_city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_activities_v" ADD CONSTRAINT "_activities_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_activities_v" ADD CONSTRAINT "_activities_v_version_difficulty_level_id_difficulty_levels_id_fk" FOREIGN KEY ("version_difficulty_level_id") REFERENCES "public"."difficulty_levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_activities_v_locales" ADD CONSTRAINT "_activities_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_activities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_activities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_activities_v_rels" ADD CONSTRAINT "_activities_v_rels_seasons_fk" FOREIGN KEY ("seasons_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_videos" ADD CONSTRAINT "attractions_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_videos_locales" ADD CONSTRAINT "attractions_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."attractions_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_brochures" ADD CONSTRAINT "attractions_brochures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attractions_brochures" ADD CONSTRAINT "attractions_brochures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_brochures_locales" ADD CONSTRAINT "attractions_brochures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."attractions_brochures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions" ADD CONSTRAINT "attractions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attractions" ADD CONSTRAINT "attractions_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attractions" ADD CONSTRAINT "attractions_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attractions_locales" ADD CONSTRAINT "attractions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_rels" ADD CONSTRAINT "attractions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_rels" ADD CONSTRAINT "attractions_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_rels" ADD CONSTRAINT "attractions_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_rels" ADD CONSTRAINT "attractions_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_rels" ADD CONSTRAINT "attractions_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_rels" ADD CONSTRAINT "attractions_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_rels" ADD CONSTRAINT "attractions_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_rels" ADD CONSTRAINT "attractions_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attractions_rels" ADD CONSTRAINT "attractions_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_version_videos" ADD CONSTRAINT "_attractions_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_attractions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_version_videos_locales" ADD CONSTRAINT "_attractions_v_version_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_attractions_v_version_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_version_brochures" ADD CONSTRAINT "_attractions_v_version_brochures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_attractions_v_version_brochures" ADD CONSTRAINT "_attractions_v_version_brochures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_attractions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_version_brochures_locales" ADD CONSTRAINT "_attractions_v_version_brochures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_attractions_v_version_brochures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v" ADD CONSTRAINT "_attractions_v_parent_id_attractions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."attractions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_attractions_v" ADD CONSTRAINT "_attractions_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_attractions_v" ADD CONSTRAINT "_attractions_v_version_city_id_cities_id_fk" FOREIGN KEY ("version_city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_attractions_v" ADD CONSTRAINT "_attractions_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_attractions_v_locales" ADD CONSTRAINT "_attractions_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_attractions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_rels" ADD CONSTRAINT "_attractions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_attractions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_rels" ADD CONSTRAINT "_attractions_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_rels" ADD CONSTRAINT "_attractions_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_rels" ADD CONSTRAINT "_attractions_v_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_rels" ADD CONSTRAINT "_attractions_v_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_rels" ADD CONSTRAINT "_attractions_v_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_rels" ADD CONSTRAINT "_attractions_v_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_rels" ADD CONSTRAINT "_attractions_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_attractions_v_rels" ADD CONSTRAINT "_attractions_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_videos" ADD CONSTRAINT "events_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_videos_locales" ADD CONSTRAINT "events_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_brochures" ADD CONSTRAINT "events_brochures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_brochures" ADD CONSTRAINT "events_brochures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_brochures_locales" ADD CONSTRAINT "events_brochures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_brochures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_videos" ADD CONSTRAINT "_events_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_videos_locales" ADD CONSTRAINT "_events_v_version_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_brochures" ADD CONSTRAINT "_events_v_version_brochures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_brochures" ADD CONSTRAINT "_events_v_version_brochures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_brochures_locales" ADD CONSTRAINT "_events_v_version_brochures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_brochures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_city_id_cities_id_fk" FOREIGN KEY ("version_city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags_locales" ADD CONSTRAINT "tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions" ADD CONSTRAINT "regions_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "regions_locales" ADD CONSTRAINT "regions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "municipalities" ADD CONSTRAINT "municipalities_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "municipalities" ADD CONSTRAINT "municipalities_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "municipalities_locales" ADD CONSTRAINT "municipalities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."municipalities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities" ADD CONSTRAINT "cities_municipality_id_municipalities_id_fk" FOREIGN KEY ("municipality_id") REFERENCES "public"."municipalities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cities" ADD CONSTRAINT "cities_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cities_locales" ADD CONSTRAINT "cities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_assigned_municipality_id_municipalities_id_fk" FOREIGN KEY ("assigned_municipality_id") REFERENCES "public"."municipalities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "visitors_rels" ADD CONSTRAINT "visitors_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."visitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visitors_rels" ADD CONSTRAINT "visitors_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "favorites" ADD CONSTRAINT "favorites_visitor_id_visitors_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "favorites_rels" ADD CONSTRAINT "favorites_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."favorites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "favorites_rels" ADD CONSTRAINT "favorites_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "favorites_rels" ADD CONSTRAINT "favorites_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "favorites_rels" ADD CONSTRAINT "favorites_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "favorites_rels" ADD CONSTRAINT "favorites_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "favorites_rels" ADD CONSTRAINT "favorites_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_days_stops" ADD CONSTRAINT "trips_days_stops_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_days" ADD CONSTRAINT "trips_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_pool" ADD CONSTRAINT "trips_pool_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips" ADD CONSTRAINT "trips_visitor_id_visitors_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trips_rels" ADD CONSTRAINT "trips_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_rels" ADD CONSTRAINT "trips_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_rels" ADD CONSTRAINT "trips_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_rels" ADD CONSTRAINT "trips_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_rels" ADD CONSTRAINT "trips_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_rels" ADD CONSTRAINT "trips_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "amenities_locales" ADD CONSTRAINT "amenities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cuisine_types_locales" ADD CONSTRAINT "cuisine_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cuisine_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dietary_options_locales" ADD CONSTRAINT "dietary_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seasons_locales" ADD CONSTRAINT "seasons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "difficulty_levels_locales" ADD CONSTRAINT "difficulty_levels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."difficulty_levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workflow_history" ADD CONSTRAINT "workflow_history_performed_by_id_users_id_fk" FOREIGN KEY ("performed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_restaurants_fk" FOREIGN KEY ("restaurants_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_attractions_fk" FOREIGN KEY ("attractions_id") REFERENCES "public"."attractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_municipalities_fk" FOREIGN KEY ("municipalities_id") REFERENCES "public"."municipalities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_visitors_fk" FOREIGN KEY ("visitors_id") REFERENCES "public"."visitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_favorites_fk" FOREIGN KEY ("favorites_id") REFERENCES "public"."favorites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trips_fk" FOREIGN KEY ("trips_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_subscriptions_fk" FOREIGN KEY ("newsletter_subscriptions_id") REFERENCES "public"."newsletter_subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_amenities_fk" FOREIGN KEY ("amenities_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cuisine_types_fk" FOREIGN KEY ("cuisine_types_id") REFERENCES "public"."cuisine_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dietary_options_fk" FOREIGN KEY ("dietary_options_id") REFERENCES "public"."dietary_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_seasons_fk" FOREIGN KEY ("seasons_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_difficulty_levels_fk" FOREIGN KEY ("difficulty_levels_id") REFERENCES "public"."difficulty_levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_workflow_history_fk" FOREIGN KEY ("workflow_history_id") REFERENCES "public"."workflow_history"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_visitors_fk" FOREIGN KEY ("visitors_id") REFERENCES "public"."visitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items_locales" ADD CONSTRAINT "footer_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_link_groups_links" ADD CONSTRAINT "footer_link_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_link_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_link_groups_links_locales" ADD CONSTRAINT "footer_link_groups_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_link_groups_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_link_groups" ADD CONSTRAINT "footer_link_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_link_groups_locales" ADD CONSTRAINT "footer_link_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_link_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_links_locales" ADD CONSTRAINT "footer_social_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_tabs_nav_items_list_links_links" ADD CONSTRAINT "main_menu_tabs_nav_items_list_links_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "main_menu_tabs_nav_items_list_links_links" ADD CONSTRAINT "main_menu_tabs_nav_items_list_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_tabs_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_tabs_nav_items_list_links_links_locales" ADD CONSTRAINT "main_menu_tabs_nav_items_list_links_links_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_tabs_nav_items_list_links_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_tabs_nav_items" ADD CONSTRAINT "main_menu_tabs_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_tabs_nav_items_locales" ADD CONSTRAINT "main_menu_tabs_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_tabs_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_tabs" ADD CONSTRAINT "main_menu_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_tabs_locales" ADD CONSTRAINT "main_menu_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_rels" ADD CONSTRAINT "main_menu_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_rels" ADD CONSTRAINT "main_menu_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_facet_config" ADD CONSTRAINT "settings_facet_config_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_home_page_id_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_terms_of_conditions_page_id_pages_id_fk" FOREIGN KEY ("terms_of_conditions_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_privacy_policy_page_id_pages_id_fk" FOREIGN KEY ("privacy_policy_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_business_terms_page_id_pages_id_fk" FOREIGN KEY ("business_terms_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_locales" ADD CONSTRAINT "settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_hero_links_locales_locale_parent_id_unique" ON "pages_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "pages_breadcrumbs_locale_idx" ON "pages_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "pages_breadcrumbs_doc_idx" ON "pages_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_version_hero_links_locales_locale_parent_id_unique" ON "_pages_v_version_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_locale_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "_pages_v_version_breadcrumbs_doc_idx" ON "_pages_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "hotels_videos_order_idx" ON "hotels_videos" USING btree ("_order");
  CREATE INDEX "hotels_videos_parent_id_idx" ON "hotels_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "hotels_videos_locales_locale_parent_id_unique" ON "hotels_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hotels_brochures_order_idx" ON "hotels_brochures" USING btree ("_order");
  CREATE INDEX "hotels_brochures_parent_id_idx" ON "hotels_brochures" USING btree ("_parent_id");
  CREATE INDEX "hotels_brochures_file_idx" ON "hotels_brochures" USING btree ("file_id");
  CREATE UNIQUE INDEX "hotels_brochures_locales_locale_parent_id_unique" ON "hotels_brochures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hotels_created_by_idx" ON "hotels" USING btree ("created_by_id");
  CREATE INDEX "hotels_city_idx" ON "hotels" USING btree ("city_id");
  CREATE INDEX "hotels_external_id_idx" ON "hotels" USING btree ("external_id");
  CREATE INDEX "hotels_external_source_idx" ON "hotels" USING btree ("external_source");
  CREATE INDEX "hotels_hero_image_idx" ON "hotels" USING btree ("hero_image_id");
  CREATE INDEX "hotels_updated_at_idx" ON "hotels" USING btree ("updated_at");
  CREATE INDEX "hotels_created_at_idx" ON "hotels" USING btree ("created_at");
  CREATE INDEX "hotels__status_idx" ON "hotels" USING btree ("_status");
  CREATE UNIQUE INDEX "hotels_slug_idx" ON "hotels_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "hotels_locales_locale_parent_id_unique" ON "hotels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hotels_rels_order_idx" ON "hotels_rels" USING btree ("order");
  CREATE INDEX "hotels_rels_parent_idx" ON "hotels_rels" USING btree ("parent_id");
  CREATE INDEX "hotels_rels_path_idx" ON "hotels_rels" USING btree ("path");
  CREATE INDEX "hotels_rels_categories_id_idx" ON "hotels_rels" USING btree ("categories_id");
  CREATE INDEX "hotels_rels_tags_id_idx" ON "hotels_rels" USING btree ("tags_id");
  CREATE INDEX "hotels_rels_hotels_id_idx" ON "hotels_rels" USING btree ("hotels_id");
  CREATE INDEX "hotels_rels_restaurants_id_idx" ON "hotels_rels" USING btree ("restaurants_id");
  CREATE INDEX "hotels_rels_activities_id_idx" ON "hotels_rels" USING btree ("activities_id");
  CREATE INDEX "hotels_rels_attractions_id_idx" ON "hotels_rels" USING btree ("attractions_id");
  CREATE INDEX "hotels_rels_events_id_idx" ON "hotels_rels" USING btree ("events_id");
  CREATE INDEX "hotels_rels_media_id_idx" ON "hotels_rels" USING btree ("media_id");
  CREATE INDEX "hotels_rels_amenities_id_idx" ON "hotels_rels" USING btree ("amenities_id");
  CREATE INDEX "_hotels_v_version_videos_order_idx" ON "_hotels_v_version_videos" USING btree ("_order");
  CREATE INDEX "_hotels_v_version_videos_parent_id_idx" ON "_hotels_v_version_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_hotels_v_version_videos_locales_locale_parent_id_unique" ON "_hotels_v_version_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_hotels_v_version_brochures_order_idx" ON "_hotels_v_version_brochures" USING btree ("_order");
  CREATE INDEX "_hotels_v_version_brochures_parent_id_idx" ON "_hotels_v_version_brochures" USING btree ("_parent_id");
  CREATE INDEX "_hotels_v_version_brochures_file_idx" ON "_hotels_v_version_brochures" USING btree ("file_id");
  CREATE UNIQUE INDEX "_hotels_v_version_brochures_locales_locale_parent_id_unique" ON "_hotels_v_version_brochures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_hotels_v_parent_idx" ON "_hotels_v" USING btree ("parent_id");
  CREATE INDEX "_hotels_v_version_version_created_by_idx" ON "_hotels_v" USING btree ("version_created_by_id");
  CREATE INDEX "_hotels_v_version_version_city_idx" ON "_hotels_v" USING btree ("version_city_id");
  CREATE INDEX "_hotels_v_version_version_external_id_idx" ON "_hotels_v" USING btree ("version_external_id");
  CREATE INDEX "_hotels_v_version_version_external_source_idx" ON "_hotels_v" USING btree ("version_external_source");
  CREATE INDEX "_hotels_v_version_version_hero_image_idx" ON "_hotels_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_hotels_v_version_version_updated_at_idx" ON "_hotels_v" USING btree ("version_updated_at");
  CREATE INDEX "_hotels_v_version_version_created_at_idx" ON "_hotels_v" USING btree ("version_created_at");
  CREATE INDEX "_hotels_v_version_version__status_idx" ON "_hotels_v" USING btree ("version__status");
  CREATE INDEX "_hotels_v_created_at_idx" ON "_hotels_v" USING btree ("created_at");
  CREATE INDEX "_hotels_v_updated_at_idx" ON "_hotels_v" USING btree ("updated_at");
  CREATE INDEX "_hotels_v_snapshot_idx" ON "_hotels_v" USING btree ("snapshot");
  CREATE INDEX "_hotels_v_published_locale_idx" ON "_hotels_v" USING btree ("published_locale");
  CREATE INDEX "_hotels_v_latest_idx" ON "_hotels_v" USING btree ("latest");
  CREATE INDEX "_hotels_v_version_version_slug_idx" ON "_hotels_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_hotels_v_locales_locale_parent_id_unique" ON "_hotels_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_hotels_v_rels_order_idx" ON "_hotels_v_rels" USING btree ("order");
  CREATE INDEX "_hotels_v_rels_parent_idx" ON "_hotels_v_rels" USING btree ("parent_id");
  CREATE INDEX "_hotels_v_rels_path_idx" ON "_hotels_v_rels" USING btree ("path");
  CREATE INDEX "_hotels_v_rels_categories_id_idx" ON "_hotels_v_rels" USING btree ("categories_id");
  CREATE INDEX "_hotels_v_rels_tags_id_idx" ON "_hotels_v_rels" USING btree ("tags_id");
  CREATE INDEX "_hotels_v_rels_hotels_id_idx" ON "_hotels_v_rels" USING btree ("hotels_id");
  CREATE INDEX "_hotels_v_rels_restaurants_id_idx" ON "_hotels_v_rels" USING btree ("restaurants_id");
  CREATE INDEX "_hotels_v_rels_activities_id_idx" ON "_hotels_v_rels" USING btree ("activities_id");
  CREATE INDEX "_hotels_v_rels_attractions_id_idx" ON "_hotels_v_rels" USING btree ("attractions_id");
  CREATE INDEX "_hotels_v_rels_events_id_idx" ON "_hotels_v_rels" USING btree ("events_id");
  CREATE INDEX "_hotels_v_rels_media_id_idx" ON "_hotels_v_rels" USING btree ("media_id");
  CREATE INDEX "_hotels_v_rels_amenities_id_idx" ON "_hotels_v_rels" USING btree ("amenities_id");
  CREATE INDEX "restaurants_videos_order_idx" ON "restaurants_videos" USING btree ("_order");
  CREATE INDEX "restaurants_videos_parent_id_idx" ON "restaurants_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "restaurants_videos_locales_locale_parent_id_unique" ON "restaurants_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "restaurants_brochures_order_idx" ON "restaurants_brochures" USING btree ("_order");
  CREATE INDEX "restaurants_brochures_parent_id_idx" ON "restaurants_brochures" USING btree ("_parent_id");
  CREATE INDEX "restaurants_brochures_file_idx" ON "restaurants_brochures" USING btree ("file_id");
  CREATE UNIQUE INDEX "restaurants_brochures_locales_locale_parent_id_unique" ON "restaurants_brochures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "restaurants_restaurant_hours_days_order_idx" ON "restaurants_restaurant_hours_days" USING btree ("order");
  CREATE INDEX "restaurants_restaurant_hours_days_parent_idx" ON "restaurants_restaurant_hours_days" USING btree ("parent_id");
  CREATE INDEX "restaurants_restaurant_hours_order_idx" ON "restaurants_restaurant_hours" USING btree ("_order");
  CREATE INDEX "restaurants_restaurant_hours_parent_id_idx" ON "restaurants_restaurant_hours" USING btree ("_parent_id");
  CREATE INDEX "restaurants_created_by_idx" ON "restaurants" USING btree ("created_by_id");
  CREATE INDEX "restaurants_city_idx" ON "restaurants" USING btree ("city_id");
  CREATE INDEX "restaurants_external_id_idx" ON "restaurants" USING btree ("external_id");
  CREATE INDEX "restaurants_external_source_idx" ON "restaurants" USING btree ("external_source");
  CREATE INDEX "restaurants_hero_image_idx" ON "restaurants" USING btree ("hero_image_id");
  CREATE INDEX "restaurants_updated_at_idx" ON "restaurants" USING btree ("updated_at");
  CREATE INDEX "restaurants_created_at_idx" ON "restaurants" USING btree ("created_at");
  CREATE INDEX "restaurants__status_idx" ON "restaurants" USING btree ("_status");
  CREATE UNIQUE INDEX "restaurants_slug_idx" ON "restaurants_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "restaurants_locales_locale_parent_id_unique" ON "restaurants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "restaurants_rels_order_idx" ON "restaurants_rels" USING btree ("order");
  CREATE INDEX "restaurants_rels_parent_idx" ON "restaurants_rels" USING btree ("parent_id");
  CREATE INDEX "restaurants_rels_path_idx" ON "restaurants_rels" USING btree ("path");
  CREATE INDEX "restaurants_rels_categories_id_idx" ON "restaurants_rels" USING btree ("categories_id");
  CREATE INDEX "restaurants_rels_tags_id_idx" ON "restaurants_rels" USING btree ("tags_id");
  CREATE INDEX "restaurants_rels_hotels_id_idx" ON "restaurants_rels" USING btree ("hotels_id");
  CREATE INDEX "restaurants_rels_restaurants_id_idx" ON "restaurants_rels" USING btree ("restaurants_id");
  CREATE INDEX "restaurants_rels_activities_id_idx" ON "restaurants_rels" USING btree ("activities_id");
  CREATE INDEX "restaurants_rels_attractions_id_idx" ON "restaurants_rels" USING btree ("attractions_id");
  CREATE INDEX "restaurants_rels_events_id_idx" ON "restaurants_rels" USING btree ("events_id");
  CREATE INDEX "restaurants_rels_media_id_idx" ON "restaurants_rels" USING btree ("media_id");
  CREATE INDEX "restaurants_rels_cuisine_types_id_idx" ON "restaurants_rels" USING btree ("cuisine_types_id");
  CREATE INDEX "restaurants_rels_dietary_options_id_idx" ON "restaurants_rels" USING btree ("dietary_options_id");
  CREATE INDEX "_restaurants_v_version_videos_order_idx" ON "_restaurants_v_version_videos" USING btree ("_order");
  CREATE INDEX "_restaurants_v_version_videos_parent_id_idx" ON "_restaurants_v_version_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_restaurants_v_version_videos_locales_locale_parent_id_uniqu" ON "_restaurants_v_version_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_restaurants_v_version_brochures_order_idx" ON "_restaurants_v_version_brochures" USING btree ("_order");
  CREATE INDEX "_restaurants_v_version_brochures_parent_id_idx" ON "_restaurants_v_version_brochures" USING btree ("_parent_id");
  CREATE INDEX "_restaurants_v_version_brochures_file_idx" ON "_restaurants_v_version_brochures" USING btree ("file_id");
  CREATE UNIQUE INDEX "_restaurants_v_version_brochures_locales_locale_parent_id_un" ON "_restaurants_v_version_brochures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_restaurants_v_version_restaurant_hours_days_order_idx" ON "_restaurants_v_version_restaurant_hours_days" USING btree ("order");
  CREATE INDEX "_restaurants_v_version_restaurant_hours_days_parent_idx" ON "_restaurants_v_version_restaurant_hours_days" USING btree ("parent_id");
  CREATE INDEX "_restaurants_v_version_restaurant_hours_order_idx" ON "_restaurants_v_version_restaurant_hours" USING btree ("_order");
  CREATE INDEX "_restaurants_v_version_restaurant_hours_parent_id_idx" ON "_restaurants_v_version_restaurant_hours" USING btree ("_parent_id");
  CREATE INDEX "_restaurants_v_parent_idx" ON "_restaurants_v" USING btree ("parent_id");
  CREATE INDEX "_restaurants_v_version_version_created_by_idx" ON "_restaurants_v" USING btree ("version_created_by_id");
  CREATE INDEX "_restaurants_v_version_version_city_idx" ON "_restaurants_v" USING btree ("version_city_id");
  CREATE INDEX "_restaurants_v_version_version_external_id_idx" ON "_restaurants_v" USING btree ("version_external_id");
  CREATE INDEX "_restaurants_v_version_version_external_source_idx" ON "_restaurants_v" USING btree ("version_external_source");
  CREATE INDEX "_restaurants_v_version_version_hero_image_idx" ON "_restaurants_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_restaurants_v_version_version_updated_at_idx" ON "_restaurants_v" USING btree ("version_updated_at");
  CREATE INDEX "_restaurants_v_version_version_created_at_idx" ON "_restaurants_v" USING btree ("version_created_at");
  CREATE INDEX "_restaurants_v_version_version__status_idx" ON "_restaurants_v" USING btree ("version__status");
  CREATE INDEX "_restaurants_v_created_at_idx" ON "_restaurants_v" USING btree ("created_at");
  CREATE INDEX "_restaurants_v_updated_at_idx" ON "_restaurants_v" USING btree ("updated_at");
  CREATE INDEX "_restaurants_v_snapshot_idx" ON "_restaurants_v" USING btree ("snapshot");
  CREATE INDEX "_restaurants_v_published_locale_idx" ON "_restaurants_v" USING btree ("published_locale");
  CREATE INDEX "_restaurants_v_latest_idx" ON "_restaurants_v" USING btree ("latest");
  CREATE INDEX "_restaurants_v_version_version_slug_idx" ON "_restaurants_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_restaurants_v_locales_locale_parent_id_unique" ON "_restaurants_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_restaurants_v_rels_order_idx" ON "_restaurants_v_rels" USING btree ("order");
  CREATE INDEX "_restaurants_v_rels_parent_idx" ON "_restaurants_v_rels" USING btree ("parent_id");
  CREATE INDEX "_restaurants_v_rels_path_idx" ON "_restaurants_v_rels" USING btree ("path");
  CREATE INDEX "_restaurants_v_rels_categories_id_idx" ON "_restaurants_v_rels" USING btree ("categories_id");
  CREATE INDEX "_restaurants_v_rels_tags_id_idx" ON "_restaurants_v_rels" USING btree ("tags_id");
  CREATE INDEX "_restaurants_v_rels_hotels_id_idx" ON "_restaurants_v_rels" USING btree ("hotels_id");
  CREATE INDEX "_restaurants_v_rels_restaurants_id_idx" ON "_restaurants_v_rels" USING btree ("restaurants_id");
  CREATE INDEX "_restaurants_v_rels_activities_id_idx" ON "_restaurants_v_rels" USING btree ("activities_id");
  CREATE INDEX "_restaurants_v_rels_attractions_id_idx" ON "_restaurants_v_rels" USING btree ("attractions_id");
  CREATE INDEX "_restaurants_v_rels_events_id_idx" ON "_restaurants_v_rels" USING btree ("events_id");
  CREATE INDEX "_restaurants_v_rels_media_id_idx" ON "_restaurants_v_rels" USING btree ("media_id");
  CREATE INDEX "_restaurants_v_rels_cuisine_types_id_idx" ON "_restaurants_v_rels" USING btree ("cuisine_types_id");
  CREATE INDEX "_restaurants_v_rels_dietary_options_id_idx" ON "_restaurants_v_rels" USING btree ("dietary_options_id");
  CREATE INDEX "activities_videos_order_idx" ON "activities_videos" USING btree ("_order");
  CREATE INDEX "activities_videos_parent_id_idx" ON "activities_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "activities_videos_locales_locale_parent_id_unique" ON "activities_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "activities_brochures_order_idx" ON "activities_brochures" USING btree ("_order");
  CREATE INDEX "activities_brochures_parent_id_idx" ON "activities_brochures" USING btree ("_parent_id");
  CREATE INDEX "activities_brochures_file_idx" ON "activities_brochures" USING btree ("file_id");
  CREATE UNIQUE INDEX "activities_brochures_locales_locale_parent_id_unique" ON "activities_brochures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "activities_includes_order_idx" ON "activities_includes" USING btree ("_order");
  CREATE INDEX "activities_includes_parent_id_idx" ON "activities_includes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "activities_includes_locales_locale_parent_id_unique" ON "activities_includes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "activities_created_by_idx" ON "activities" USING btree ("created_by_id");
  CREATE INDEX "activities_city_idx" ON "activities" USING btree ("city_id");
  CREATE INDEX "activities_external_id_idx" ON "activities" USING btree ("external_id");
  CREATE INDEX "activities_external_source_idx" ON "activities" USING btree ("external_source");
  CREATE INDEX "activities_hero_image_idx" ON "activities" USING btree ("hero_image_id");
  CREATE INDEX "activities_difficulty_level_idx" ON "activities" USING btree ("difficulty_level_id");
  CREATE INDEX "activities_updated_at_idx" ON "activities" USING btree ("updated_at");
  CREATE INDEX "activities_created_at_idx" ON "activities" USING btree ("created_at");
  CREATE INDEX "activities__status_idx" ON "activities" USING btree ("_status");
  CREATE UNIQUE INDEX "activities_slug_idx" ON "activities_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "activities_locales_locale_parent_id_unique" ON "activities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "activities_rels_order_idx" ON "activities_rels" USING btree ("order");
  CREATE INDEX "activities_rels_parent_idx" ON "activities_rels" USING btree ("parent_id");
  CREATE INDEX "activities_rels_path_idx" ON "activities_rels" USING btree ("path");
  CREATE INDEX "activities_rels_categories_id_idx" ON "activities_rels" USING btree ("categories_id");
  CREATE INDEX "activities_rels_tags_id_idx" ON "activities_rels" USING btree ("tags_id");
  CREATE INDEX "activities_rels_hotels_id_idx" ON "activities_rels" USING btree ("hotels_id");
  CREATE INDEX "activities_rels_restaurants_id_idx" ON "activities_rels" USING btree ("restaurants_id");
  CREATE INDEX "activities_rels_activities_id_idx" ON "activities_rels" USING btree ("activities_id");
  CREATE INDEX "activities_rels_attractions_id_idx" ON "activities_rels" USING btree ("attractions_id");
  CREATE INDEX "activities_rels_events_id_idx" ON "activities_rels" USING btree ("events_id");
  CREATE INDEX "activities_rels_media_id_idx" ON "activities_rels" USING btree ("media_id");
  CREATE INDEX "activities_rels_seasons_id_idx" ON "activities_rels" USING btree ("seasons_id");
  CREATE INDEX "_activities_v_version_videos_order_idx" ON "_activities_v_version_videos" USING btree ("_order");
  CREATE INDEX "_activities_v_version_videos_parent_id_idx" ON "_activities_v_version_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_activities_v_version_videos_locales_locale_parent_id_unique" ON "_activities_v_version_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_activities_v_version_brochures_order_idx" ON "_activities_v_version_brochures" USING btree ("_order");
  CREATE INDEX "_activities_v_version_brochures_parent_id_idx" ON "_activities_v_version_brochures" USING btree ("_parent_id");
  CREATE INDEX "_activities_v_version_brochures_file_idx" ON "_activities_v_version_brochures" USING btree ("file_id");
  CREATE UNIQUE INDEX "_activities_v_version_brochures_locales_locale_parent_id_uni" ON "_activities_v_version_brochures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_activities_v_version_includes_order_idx" ON "_activities_v_version_includes" USING btree ("_order");
  CREATE INDEX "_activities_v_version_includes_parent_id_idx" ON "_activities_v_version_includes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_activities_v_version_includes_locales_locale_parent_id_uniq" ON "_activities_v_version_includes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_activities_v_parent_idx" ON "_activities_v" USING btree ("parent_id");
  CREATE INDEX "_activities_v_version_version_created_by_idx" ON "_activities_v" USING btree ("version_created_by_id");
  CREATE INDEX "_activities_v_version_version_city_idx" ON "_activities_v" USING btree ("version_city_id");
  CREATE INDEX "_activities_v_version_version_external_id_idx" ON "_activities_v" USING btree ("version_external_id");
  CREATE INDEX "_activities_v_version_version_external_source_idx" ON "_activities_v" USING btree ("version_external_source");
  CREATE INDEX "_activities_v_version_version_hero_image_idx" ON "_activities_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_activities_v_version_version_difficulty_level_idx" ON "_activities_v" USING btree ("version_difficulty_level_id");
  CREATE INDEX "_activities_v_version_version_updated_at_idx" ON "_activities_v" USING btree ("version_updated_at");
  CREATE INDEX "_activities_v_version_version_created_at_idx" ON "_activities_v" USING btree ("version_created_at");
  CREATE INDEX "_activities_v_version_version__status_idx" ON "_activities_v" USING btree ("version__status");
  CREATE INDEX "_activities_v_created_at_idx" ON "_activities_v" USING btree ("created_at");
  CREATE INDEX "_activities_v_updated_at_idx" ON "_activities_v" USING btree ("updated_at");
  CREATE INDEX "_activities_v_snapshot_idx" ON "_activities_v" USING btree ("snapshot");
  CREATE INDEX "_activities_v_published_locale_idx" ON "_activities_v" USING btree ("published_locale");
  CREATE INDEX "_activities_v_latest_idx" ON "_activities_v" USING btree ("latest");
  CREATE INDEX "_activities_v_version_version_slug_idx" ON "_activities_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_activities_v_locales_locale_parent_id_unique" ON "_activities_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_activities_v_rels_order_idx" ON "_activities_v_rels" USING btree ("order");
  CREATE INDEX "_activities_v_rels_parent_idx" ON "_activities_v_rels" USING btree ("parent_id");
  CREATE INDEX "_activities_v_rels_path_idx" ON "_activities_v_rels" USING btree ("path");
  CREATE INDEX "_activities_v_rels_categories_id_idx" ON "_activities_v_rels" USING btree ("categories_id");
  CREATE INDEX "_activities_v_rels_tags_id_idx" ON "_activities_v_rels" USING btree ("tags_id");
  CREATE INDEX "_activities_v_rels_hotels_id_idx" ON "_activities_v_rels" USING btree ("hotels_id");
  CREATE INDEX "_activities_v_rels_restaurants_id_idx" ON "_activities_v_rels" USING btree ("restaurants_id");
  CREATE INDEX "_activities_v_rels_activities_id_idx" ON "_activities_v_rels" USING btree ("activities_id");
  CREATE INDEX "_activities_v_rels_attractions_id_idx" ON "_activities_v_rels" USING btree ("attractions_id");
  CREATE INDEX "_activities_v_rels_events_id_idx" ON "_activities_v_rels" USING btree ("events_id");
  CREATE INDEX "_activities_v_rels_media_id_idx" ON "_activities_v_rels" USING btree ("media_id");
  CREATE INDEX "_activities_v_rels_seasons_id_idx" ON "_activities_v_rels" USING btree ("seasons_id");
  CREATE INDEX "attractions_videos_order_idx" ON "attractions_videos" USING btree ("_order");
  CREATE INDEX "attractions_videos_parent_id_idx" ON "attractions_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "attractions_videos_locales_locale_parent_id_unique" ON "attractions_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "attractions_brochures_order_idx" ON "attractions_brochures" USING btree ("_order");
  CREATE INDEX "attractions_brochures_parent_id_idx" ON "attractions_brochures" USING btree ("_parent_id");
  CREATE INDEX "attractions_brochures_file_idx" ON "attractions_brochures" USING btree ("file_id");
  CREATE UNIQUE INDEX "attractions_brochures_locales_locale_parent_id_unique" ON "attractions_brochures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "attractions_created_by_idx" ON "attractions" USING btree ("created_by_id");
  CREATE INDEX "attractions_city_idx" ON "attractions" USING btree ("city_id");
  CREATE INDEX "attractions_external_id_idx" ON "attractions" USING btree ("external_id");
  CREATE INDEX "attractions_external_source_idx" ON "attractions" USING btree ("external_source");
  CREATE INDEX "attractions_hero_image_idx" ON "attractions" USING btree ("hero_image_id");
  CREATE INDEX "attractions_updated_at_idx" ON "attractions" USING btree ("updated_at");
  CREATE INDEX "attractions_created_at_idx" ON "attractions" USING btree ("created_at");
  CREATE INDEX "attractions__status_idx" ON "attractions" USING btree ("_status");
  CREATE UNIQUE INDEX "attractions_slug_idx" ON "attractions_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "attractions_locales_locale_parent_id_unique" ON "attractions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "attractions_rels_order_idx" ON "attractions_rels" USING btree ("order");
  CREATE INDEX "attractions_rels_parent_idx" ON "attractions_rels" USING btree ("parent_id");
  CREATE INDEX "attractions_rels_path_idx" ON "attractions_rels" USING btree ("path");
  CREATE INDEX "attractions_rels_categories_id_idx" ON "attractions_rels" USING btree ("categories_id");
  CREATE INDEX "attractions_rels_tags_id_idx" ON "attractions_rels" USING btree ("tags_id");
  CREATE INDEX "attractions_rels_hotels_id_idx" ON "attractions_rels" USING btree ("hotels_id");
  CREATE INDEX "attractions_rels_restaurants_id_idx" ON "attractions_rels" USING btree ("restaurants_id");
  CREATE INDEX "attractions_rels_activities_id_idx" ON "attractions_rels" USING btree ("activities_id");
  CREATE INDEX "attractions_rels_attractions_id_idx" ON "attractions_rels" USING btree ("attractions_id");
  CREATE INDEX "attractions_rels_events_id_idx" ON "attractions_rels" USING btree ("events_id");
  CREATE INDEX "attractions_rels_media_id_idx" ON "attractions_rels" USING btree ("media_id");
  CREATE INDEX "_attractions_v_version_videos_order_idx" ON "_attractions_v_version_videos" USING btree ("_order");
  CREATE INDEX "_attractions_v_version_videos_parent_id_idx" ON "_attractions_v_version_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_attractions_v_version_videos_locales_locale_parent_id_uniqu" ON "_attractions_v_version_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_attractions_v_version_brochures_order_idx" ON "_attractions_v_version_brochures" USING btree ("_order");
  CREATE INDEX "_attractions_v_version_brochures_parent_id_idx" ON "_attractions_v_version_brochures" USING btree ("_parent_id");
  CREATE INDEX "_attractions_v_version_brochures_file_idx" ON "_attractions_v_version_brochures" USING btree ("file_id");
  CREATE UNIQUE INDEX "_attractions_v_version_brochures_locales_locale_parent_id_un" ON "_attractions_v_version_brochures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_attractions_v_parent_idx" ON "_attractions_v" USING btree ("parent_id");
  CREATE INDEX "_attractions_v_version_version_created_by_idx" ON "_attractions_v" USING btree ("version_created_by_id");
  CREATE INDEX "_attractions_v_version_version_city_idx" ON "_attractions_v" USING btree ("version_city_id");
  CREATE INDEX "_attractions_v_version_version_external_id_idx" ON "_attractions_v" USING btree ("version_external_id");
  CREATE INDEX "_attractions_v_version_version_external_source_idx" ON "_attractions_v" USING btree ("version_external_source");
  CREATE INDEX "_attractions_v_version_version_hero_image_idx" ON "_attractions_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_attractions_v_version_version_updated_at_idx" ON "_attractions_v" USING btree ("version_updated_at");
  CREATE INDEX "_attractions_v_version_version_created_at_idx" ON "_attractions_v" USING btree ("version_created_at");
  CREATE INDEX "_attractions_v_version_version__status_idx" ON "_attractions_v" USING btree ("version__status");
  CREATE INDEX "_attractions_v_created_at_idx" ON "_attractions_v" USING btree ("created_at");
  CREATE INDEX "_attractions_v_updated_at_idx" ON "_attractions_v" USING btree ("updated_at");
  CREATE INDEX "_attractions_v_snapshot_idx" ON "_attractions_v" USING btree ("snapshot");
  CREATE INDEX "_attractions_v_published_locale_idx" ON "_attractions_v" USING btree ("published_locale");
  CREATE INDEX "_attractions_v_latest_idx" ON "_attractions_v" USING btree ("latest");
  CREATE INDEX "_attractions_v_version_version_slug_idx" ON "_attractions_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_attractions_v_locales_locale_parent_id_unique" ON "_attractions_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_attractions_v_rels_order_idx" ON "_attractions_v_rels" USING btree ("order");
  CREATE INDEX "_attractions_v_rels_parent_idx" ON "_attractions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_attractions_v_rels_path_idx" ON "_attractions_v_rels" USING btree ("path");
  CREATE INDEX "_attractions_v_rels_categories_id_idx" ON "_attractions_v_rels" USING btree ("categories_id");
  CREATE INDEX "_attractions_v_rels_tags_id_idx" ON "_attractions_v_rels" USING btree ("tags_id");
  CREATE INDEX "_attractions_v_rels_hotels_id_idx" ON "_attractions_v_rels" USING btree ("hotels_id");
  CREATE INDEX "_attractions_v_rels_restaurants_id_idx" ON "_attractions_v_rels" USING btree ("restaurants_id");
  CREATE INDEX "_attractions_v_rels_activities_id_idx" ON "_attractions_v_rels" USING btree ("activities_id");
  CREATE INDEX "_attractions_v_rels_attractions_id_idx" ON "_attractions_v_rels" USING btree ("attractions_id");
  CREATE INDEX "_attractions_v_rels_events_id_idx" ON "_attractions_v_rels" USING btree ("events_id");
  CREATE INDEX "_attractions_v_rels_media_id_idx" ON "_attractions_v_rels" USING btree ("media_id");
  CREATE INDEX "events_videos_order_idx" ON "events_videos" USING btree ("_order");
  CREATE INDEX "events_videos_parent_id_idx" ON "events_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_videos_locales_locale_parent_id_unique" ON "events_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_brochures_order_idx" ON "events_brochures" USING btree ("_order");
  CREATE INDEX "events_brochures_parent_id_idx" ON "events_brochures" USING btree ("_parent_id");
  CREATE INDEX "events_brochures_file_idx" ON "events_brochures" USING btree ("file_id");
  CREATE UNIQUE INDEX "events_brochures_locales_locale_parent_id_unique" ON "events_brochures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_created_by_idx" ON "events" USING btree ("created_by_id");
  CREATE INDEX "events_city_idx" ON "events" USING btree ("city_id");
  CREATE INDEX "events_external_id_idx" ON "events" USING btree ("external_id");
  CREATE INDEX "events_external_source_idx" ON "events" USING btree ("external_source");
  CREATE INDEX "events_hero_image_idx" ON "events" USING btree ("hero_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_categories_id_idx" ON "events_rels" USING btree ("categories_id");
  CREATE INDEX "events_rels_tags_id_idx" ON "events_rels" USING btree ("tags_id");
  CREATE INDEX "events_rels_hotels_id_idx" ON "events_rels" USING btree ("hotels_id");
  CREATE INDEX "events_rels_restaurants_id_idx" ON "events_rels" USING btree ("restaurants_id");
  CREATE INDEX "events_rels_activities_id_idx" ON "events_rels" USING btree ("activities_id");
  CREATE INDEX "events_rels_attractions_id_idx" ON "events_rels" USING btree ("attractions_id");
  CREATE INDEX "events_rels_events_id_idx" ON "events_rels" USING btree ("events_id");
  CREATE INDEX "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");
  CREATE INDEX "_events_v_version_videos_order_idx" ON "_events_v_version_videos" USING btree ("_order");
  CREATE INDEX "_events_v_version_videos_parent_id_idx" ON "_events_v_version_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_events_v_version_videos_locales_locale_parent_id_unique" ON "_events_v_version_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_version_brochures_order_idx" ON "_events_v_version_brochures" USING btree ("_order");
  CREATE INDEX "_events_v_version_brochures_parent_id_idx" ON "_events_v_version_brochures" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_brochures_file_idx" ON "_events_v_version_brochures" USING btree ("file_id");
  CREATE UNIQUE INDEX "_events_v_version_brochures_locales_locale_parent_id_unique" ON "_events_v_version_brochures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_created_by_idx" ON "_events_v" USING btree ("version_created_by_id");
  CREATE INDEX "_events_v_version_version_city_idx" ON "_events_v" USING btree ("version_city_id");
  CREATE INDEX "_events_v_version_version_external_id_idx" ON "_events_v" USING btree ("version_external_id");
  CREATE INDEX "_events_v_version_version_external_source_idx" ON "_events_v" USING btree ("version_external_source");
  CREATE INDEX "_events_v_version_version_hero_image_idx" ON "_events_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_categories_id_idx" ON "_events_v_rels" USING btree ("categories_id");
  CREATE INDEX "_events_v_rels_tags_id_idx" ON "_events_v_rels" USING btree ("tags_id");
  CREATE INDEX "_events_v_rels_hotels_id_idx" ON "_events_v_rels" USING btree ("hotels_id");
  CREATE INDEX "_events_v_rels_restaurants_id_idx" ON "_events_v_rels" USING btree ("restaurants_id");
  CREATE INDEX "_events_v_rels_activities_id_idx" ON "_events_v_rels" USING btree ("activities_id");
  CREATE INDEX "_events_v_rels_attractions_id_idx" ON "_events_v_rels" USING btree ("attractions_id");
  CREATE INDEX "_events_v_rels_events_id_idx" ON "_events_v_rels" USING btree ("events_id");
  CREATE INDEX "_events_v_rels_media_id_idx" ON "_events_v_rels" USING btree ("media_id");
  CREATE INDEX "media_created_by_idx" ON "media" USING btree ("created_by_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_locale_idx" ON "categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "categories_hero_image_idx" ON "categories" USING btree ("hero_image_id");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tags_hero_image_idx" ON "tags" USING btree ("hero_image_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "tags_locales_locale_parent_id_unique" ON "tags_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "regions_code_idx" ON "regions" USING btree ("code");
  CREATE INDEX "regions_ekatte_code_idx" ON "regions" USING btree ("ekatte_code");
  CREATE INDEX "regions_hero_image_idx" ON "regions" USING btree ("hero_image_id");
  CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at");
  CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at");
  CREATE UNIQUE INDEX "regions_locales_locale_parent_id_unique" ON "regions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "municipalities_code_idx" ON "municipalities" USING btree ("code");
  CREATE INDEX "municipalities_region_idx" ON "municipalities" USING btree ("region_id");
  CREATE INDEX "municipalities_ekatte_code_idx" ON "municipalities" USING btree ("ekatte_code");
  CREATE INDEX "municipalities_hero_image_idx" ON "municipalities" USING btree ("hero_image_id");
  CREATE INDEX "municipalities_updated_at_idx" ON "municipalities" USING btree ("updated_at");
  CREATE INDEX "municipalities_created_at_idx" ON "municipalities" USING btree ("created_at");
  CREATE UNIQUE INDEX "municipalities_locales_locale_parent_id_unique" ON "municipalities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cities_municipality_idx" ON "cities" USING btree ("municipality_id");
  CREATE INDEX "cities_ekatte_code_idx" ON "cities" USING btree ("ekatte_code");
  CREATE INDEX "cities_hero_image_idx" ON "cities" USING btree ("hero_image_id");
  CREATE INDEX "cities_updated_at_idx" ON "cities" USING btree ("updated_at");
  CREATE INDEX "cities_created_at_idx" ON "cities" USING btree ("created_at");
  CREATE UNIQUE INDEX "cities_locales_locale_parent_id_unique" ON "cities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "users_keycloak_id_idx" ON "users" USING btree ("keycloak_id");
  CREATE INDEX "users_assigned_municipality_idx" ON "users" USING btree ("assigned_municipality_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "visitors_email_idx" ON "visitors" USING btree ("email");
  CREATE UNIQUE INDEX "visitors_keycloak_id_idx" ON "visitors" USING btree ("keycloak_id");
  CREATE INDEX "visitors_updated_at_idx" ON "visitors" USING btree ("updated_at");
  CREATE INDEX "visitors_created_at_idx" ON "visitors" USING btree ("created_at");
  CREATE INDEX "visitors_rels_order_idx" ON "visitors_rels" USING btree ("order");
  CREATE INDEX "visitors_rels_parent_idx" ON "visitors_rels" USING btree ("parent_id");
  CREATE INDEX "visitors_rels_path_idx" ON "visitors_rels" USING btree ("path");
  CREATE INDEX "visitors_rels_categories_id_idx" ON "visitors_rels" USING btree ("categories_id");
  CREATE INDEX "favorites_visitor_idx" ON "favorites" USING btree ("visitor_id");
  CREATE INDEX "favorites_updated_at_idx" ON "favorites" USING btree ("updated_at");
  CREATE INDEX "favorites_created_at_idx" ON "favorites" USING btree ("created_at");
  CREATE INDEX "favorites_rels_order_idx" ON "favorites_rels" USING btree ("order");
  CREATE INDEX "favorites_rels_parent_idx" ON "favorites_rels" USING btree ("parent_id");
  CREATE INDEX "favorites_rels_path_idx" ON "favorites_rels" USING btree ("path");
  CREATE INDEX "favorites_rels_hotels_id_idx" ON "favorites_rels" USING btree ("hotels_id");
  CREATE INDEX "favorites_rels_restaurants_id_idx" ON "favorites_rels" USING btree ("restaurants_id");
  CREATE INDEX "favorites_rels_activities_id_idx" ON "favorites_rels" USING btree ("activities_id");
  CREATE INDEX "favorites_rels_attractions_id_idx" ON "favorites_rels" USING btree ("attractions_id");
  CREATE INDEX "favorites_rels_events_id_idx" ON "favorites_rels" USING btree ("events_id");
  CREATE INDEX "trips_days_stops_order_idx" ON "trips_days_stops" USING btree ("_order");
  CREATE INDEX "trips_days_stops_parent_id_idx" ON "trips_days_stops" USING btree ("_parent_id");
  CREATE INDEX "trips_days_order_idx" ON "trips_days" USING btree ("_order");
  CREATE INDEX "trips_days_parent_id_idx" ON "trips_days" USING btree ("_parent_id");
  CREATE INDEX "trips_pool_order_idx" ON "trips_pool" USING btree ("_order");
  CREATE INDEX "trips_pool_parent_id_idx" ON "trips_pool" USING btree ("_parent_id");
  CREATE INDEX "trips_visitor_idx" ON "trips" USING btree ("visitor_id");
  CREATE INDEX "trips_updated_at_idx" ON "trips" USING btree ("updated_at");
  CREATE INDEX "trips_created_at_idx" ON "trips" USING btree ("created_at");
  CREATE INDEX "trips_rels_order_idx" ON "trips_rels" USING btree ("order");
  CREATE INDEX "trips_rels_parent_idx" ON "trips_rels" USING btree ("parent_id");
  CREATE INDEX "trips_rels_path_idx" ON "trips_rels" USING btree ("path");
  CREATE INDEX "trips_rels_hotels_id_idx" ON "trips_rels" USING btree ("hotels_id");
  CREATE INDEX "trips_rels_restaurants_id_idx" ON "trips_rels" USING btree ("restaurants_id");
  CREATE INDEX "trips_rels_activities_id_idx" ON "trips_rels" USING btree ("activities_id");
  CREATE INDEX "trips_rels_attractions_id_idx" ON "trips_rels" USING btree ("attractions_id");
  CREATE INDEX "trips_rels_events_id_idx" ON "trips_rels" USING btree ("events_id");
  CREATE UNIQUE INDEX "newsletter_subscriptions_email_idx" ON "newsletter_subscriptions" USING btree ("email");
  CREATE INDEX "newsletter_subscriptions_updated_at_idx" ON "newsletter_subscriptions" USING btree ("updated_at");
  CREATE INDEX "newsletter_subscriptions_created_at_idx" ON "newsletter_subscriptions" USING btree ("created_at");
  CREATE UNIQUE INDEX "amenities_value_idx" ON "amenities" USING btree ("value");
  CREATE INDEX "amenities_updated_at_idx" ON "amenities" USING btree ("updated_at");
  CREATE INDEX "amenities_created_at_idx" ON "amenities" USING btree ("created_at");
  CREATE UNIQUE INDEX "amenities_locales_locale_parent_id_unique" ON "amenities_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "cuisine_types_value_idx" ON "cuisine_types" USING btree ("value");
  CREATE INDEX "cuisine_types_updated_at_idx" ON "cuisine_types" USING btree ("updated_at");
  CREATE INDEX "cuisine_types_created_at_idx" ON "cuisine_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "cuisine_types_locales_locale_parent_id_unique" ON "cuisine_types_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dietary_options_value_idx" ON "dietary_options" USING btree ("value");
  CREATE INDEX "dietary_options_updated_at_idx" ON "dietary_options" USING btree ("updated_at");
  CREATE INDEX "dietary_options_created_at_idx" ON "dietary_options" USING btree ("created_at");
  CREATE UNIQUE INDEX "dietary_options_locales_locale_parent_id_unique" ON "dietary_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "seasons_value_idx" ON "seasons" USING btree ("value");
  CREATE INDEX "seasons_updated_at_idx" ON "seasons" USING btree ("updated_at");
  CREATE INDEX "seasons_created_at_idx" ON "seasons" USING btree ("created_at");
  CREATE UNIQUE INDEX "seasons_locales_locale_parent_id_unique" ON "seasons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "difficulty_levels_value_idx" ON "difficulty_levels" USING btree ("value");
  CREATE INDEX "difficulty_levels_updated_at_idx" ON "difficulty_levels" USING btree ("updated_at");
  CREATE INDEX "difficulty_levels_created_at_idx" ON "difficulty_levels" USING btree ("created_at");
  CREATE UNIQUE INDEX "difficulty_levels_locales_locale_parent_id_unique" ON "difficulty_levels_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "workflow_history_performed_by_idx" ON "workflow_history" USING btree ("performed_by_id");
  CREATE INDEX "workflow_history_updated_at_idx" ON "workflow_history" USING btree ("updated_at");
  CREATE INDEX "workflow_history_created_at_idx" ON "workflow_history" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_concurrency_key_idx" ON "payload_jobs" USING btree ("concurrency_key");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_hotels_id_idx" ON "payload_locked_documents_rels" USING btree ("hotels_id");
  CREATE INDEX "payload_locked_documents_rels_restaurants_id_idx" ON "payload_locked_documents_rels" USING btree ("restaurants_id");
  CREATE INDEX "payload_locked_documents_rels_activities_id_idx" ON "payload_locked_documents_rels" USING btree ("activities_id");
  CREATE INDEX "payload_locked_documents_rels_attractions_id_idx" ON "payload_locked_documents_rels" USING btree ("attractions_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id");
  CREATE INDEX "payload_locked_documents_rels_municipalities_id_idx" ON "payload_locked_documents_rels" USING btree ("municipalities_id");
  CREATE INDEX "payload_locked_documents_rels_cities_id_idx" ON "payload_locked_documents_rels" USING btree ("cities_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_visitors_id_idx" ON "payload_locked_documents_rels" USING btree ("visitors_id");
  CREATE INDEX "payload_locked_documents_rels_favorites_id_idx" ON "payload_locked_documents_rels" USING btree ("favorites_id");
  CREATE INDEX "payload_locked_documents_rels_trips_id_idx" ON "payload_locked_documents_rels" USING btree ("trips_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_subscriptions_i_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_subscriptions_id");
  CREATE INDEX "payload_locked_documents_rels_amenities_id_idx" ON "payload_locked_documents_rels" USING btree ("amenities_id");
  CREATE INDEX "payload_locked_documents_rels_cuisine_types_id_idx" ON "payload_locked_documents_rels" USING btree ("cuisine_types_id");
  CREATE INDEX "payload_locked_documents_rels_dietary_options_id_idx" ON "payload_locked_documents_rels" USING btree ("dietary_options_id");
  CREATE INDEX "payload_locked_documents_rels_seasons_id_idx" ON "payload_locked_documents_rels" USING btree ("seasons_id");
  CREATE INDEX "payload_locked_documents_rels_difficulty_levels_id_idx" ON "payload_locked_documents_rels" USING btree ("difficulty_levels_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_workflow_history_id_idx" ON "payload_locked_documents_rels" USING btree ("workflow_history_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_visitors_id_idx" ON "payload_preferences_rels" USING btree ("visitors_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_nav_items_locales_locale_parent_id_unique" ON "footer_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_link_groups_links_order_idx" ON "footer_link_groups_links" USING btree ("_order");
  CREATE INDEX "footer_link_groups_links_parent_id_idx" ON "footer_link_groups_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_link_groups_links_locales_locale_parent_id_unique" ON "footer_link_groups_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_link_groups_order_idx" ON "footer_link_groups" USING btree ("_order");
  CREATE INDEX "footer_link_groups_parent_id_idx" ON "footer_link_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_link_groups_locales_locale_parent_id_unique" ON "footer_link_groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_social_links_locales_locale_parent_id_unique" ON "footer_social_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "main_menu_tabs_nav_items_list_links_links_order_idx" ON "main_menu_tabs_nav_items_list_links_links" USING btree ("_order");
  CREATE INDEX "main_menu_tabs_nav_items_list_links_links_parent_id_idx" ON "main_menu_tabs_nav_items_list_links_links" USING btree ("_parent_id");
  CREATE INDEX "main_menu_tabs_nav_items_list_links_links_image_idx" ON "main_menu_tabs_nav_items_list_links_links" USING btree ("image_id");
  CREATE UNIQUE INDEX "main_menu_tabs_nav_items_list_links_links_locales_locale_par" ON "main_menu_tabs_nav_items_list_links_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_menu_tabs_nav_items_order_idx" ON "main_menu_tabs_nav_items" USING btree ("_order");
  CREATE INDEX "main_menu_tabs_nav_items_parent_id_idx" ON "main_menu_tabs_nav_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "main_menu_tabs_nav_items_locales_locale_parent_id_unique" ON "main_menu_tabs_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_menu_tabs_order_idx" ON "main_menu_tabs" USING btree ("_order");
  CREATE INDEX "main_menu_tabs_parent_id_idx" ON "main_menu_tabs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "main_menu_tabs_locales_locale_parent_id_unique" ON "main_menu_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_menu_rels_order_idx" ON "main_menu_rels" USING btree ("order");
  CREATE INDEX "main_menu_rels_parent_idx" ON "main_menu_rels" USING btree ("parent_id");
  CREATE INDEX "main_menu_rels_path_idx" ON "main_menu_rels" USING btree ("path");
  CREATE INDEX "main_menu_rels_pages_id_idx" ON "main_menu_rels" USING btree ("pages_id");
  CREATE INDEX "settings_facet_config_order_idx" ON "settings_facet_config" USING btree ("_order");
  CREATE INDEX "settings_facet_config_parent_id_idx" ON "settings_facet_config" USING btree ("_parent_id");
  CREATE INDEX "settings_home_page_idx" ON "settings" USING btree ("home_page_id");
  CREATE INDEX "settings_terms_of_conditions_page_idx" ON "settings" USING btree ("terms_of_conditions_page_id");
  CREATE INDEX "settings_privacy_policy_page_idx" ON "settings" USING btree ("privacy_policy_page_id");
  CREATE INDEX "settings_business_terms_page_idx" ON "settings" USING btree ("business_terms_page_id");
  CREATE UNIQUE INDEX "settings_locales_locale_parent_id_unique" ON "settings_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_hero_links_locales" CASCADE;
  DROP TABLE "pages_breadcrumbs" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "_pages_v_version_hero_links_locales" CASCADE;
  DROP TABLE "_pages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "hotels_videos" CASCADE;
  DROP TABLE "hotels_videos_locales" CASCADE;
  DROP TABLE "hotels_brochures" CASCADE;
  DROP TABLE "hotels_brochures_locales" CASCADE;
  DROP TABLE "hotels" CASCADE;
  DROP TABLE "hotels_locales" CASCADE;
  DROP TABLE "hotels_rels" CASCADE;
  DROP TABLE "_hotels_v_version_videos" CASCADE;
  DROP TABLE "_hotels_v_version_videos_locales" CASCADE;
  DROP TABLE "_hotels_v_version_brochures" CASCADE;
  DROP TABLE "_hotels_v_version_brochures_locales" CASCADE;
  DROP TABLE "_hotels_v" CASCADE;
  DROP TABLE "_hotels_v_locales" CASCADE;
  DROP TABLE "_hotels_v_rels" CASCADE;
  DROP TABLE "restaurants_videos" CASCADE;
  DROP TABLE "restaurants_videos_locales" CASCADE;
  DROP TABLE "restaurants_brochures" CASCADE;
  DROP TABLE "restaurants_brochures_locales" CASCADE;
  DROP TABLE "restaurants_restaurant_hours_days" CASCADE;
  DROP TABLE "restaurants_restaurant_hours" CASCADE;
  DROP TABLE "restaurants" CASCADE;
  DROP TABLE "restaurants_locales" CASCADE;
  DROP TABLE "restaurants_rels" CASCADE;
  DROP TABLE "_restaurants_v_version_videos" CASCADE;
  DROP TABLE "_restaurants_v_version_videos_locales" CASCADE;
  DROP TABLE "_restaurants_v_version_brochures" CASCADE;
  DROP TABLE "_restaurants_v_version_brochures_locales" CASCADE;
  DROP TABLE "_restaurants_v_version_restaurant_hours_days" CASCADE;
  DROP TABLE "_restaurants_v_version_restaurant_hours" CASCADE;
  DROP TABLE "_restaurants_v" CASCADE;
  DROP TABLE "_restaurants_v_locales" CASCADE;
  DROP TABLE "_restaurants_v_rels" CASCADE;
  DROP TABLE "activities_videos" CASCADE;
  DROP TABLE "activities_videos_locales" CASCADE;
  DROP TABLE "activities_brochures" CASCADE;
  DROP TABLE "activities_brochures_locales" CASCADE;
  DROP TABLE "activities_includes" CASCADE;
  DROP TABLE "activities_includes_locales" CASCADE;
  DROP TABLE "activities" CASCADE;
  DROP TABLE "activities_locales" CASCADE;
  DROP TABLE "activities_rels" CASCADE;
  DROP TABLE "_activities_v_version_videos" CASCADE;
  DROP TABLE "_activities_v_version_videos_locales" CASCADE;
  DROP TABLE "_activities_v_version_brochures" CASCADE;
  DROP TABLE "_activities_v_version_brochures_locales" CASCADE;
  DROP TABLE "_activities_v_version_includes" CASCADE;
  DROP TABLE "_activities_v_version_includes_locales" CASCADE;
  DROP TABLE "_activities_v" CASCADE;
  DROP TABLE "_activities_v_locales" CASCADE;
  DROP TABLE "_activities_v_rels" CASCADE;
  DROP TABLE "attractions_videos" CASCADE;
  DROP TABLE "attractions_videos_locales" CASCADE;
  DROP TABLE "attractions_brochures" CASCADE;
  DROP TABLE "attractions_brochures_locales" CASCADE;
  DROP TABLE "attractions" CASCADE;
  DROP TABLE "attractions_locales" CASCADE;
  DROP TABLE "attractions_rels" CASCADE;
  DROP TABLE "_attractions_v_version_videos" CASCADE;
  DROP TABLE "_attractions_v_version_videos_locales" CASCADE;
  DROP TABLE "_attractions_v_version_brochures" CASCADE;
  DROP TABLE "_attractions_v_version_brochures_locales" CASCADE;
  DROP TABLE "_attractions_v" CASCADE;
  DROP TABLE "_attractions_v_locales" CASCADE;
  DROP TABLE "_attractions_v_rels" CASCADE;
  DROP TABLE "events_videos" CASCADE;
  DROP TABLE "events_videos_locales" CASCADE;
  DROP TABLE "events_brochures" CASCADE;
  DROP TABLE "events_brochures_locales" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v_version_videos" CASCADE;
  DROP TABLE "_events_v_version_videos_locales" CASCADE;
  DROP TABLE "_events_v_version_brochures" CASCADE;
  DROP TABLE "_events_v_version_brochures_locales" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_locales" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_locales" CASCADE;
  DROP TABLE "regions" CASCADE;
  DROP TABLE "regions_locales" CASCADE;
  DROP TABLE "municipalities" CASCADE;
  DROP TABLE "municipalities_locales" CASCADE;
  DROP TABLE "cities" CASCADE;
  DROP TABLE "cities_locales" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "visitors" CASCADE;
  DROP TABLE "visitors_rels" CASCADE;
  DROP TABLE "favorites" CASCADE;
  DROP TABLE "favorites_rels" CASCADE;
  DROP TABLE "trips_days_stops" CASCADE;
  DROP TABLE "trips_days" CASCADE;
  DROP TABLE "trips_pool" CASCADE;
  DROP TABLE "trips" CASCADE;
  DROP TABLE "trips_rels" CASCADE;
  DROP TABLE "newsletter_subscriptions" CASCADE;
  DROP TABLE "amenities" CASCADE;
  DROP TABLE "amenities_locales" CASCADE;
  DROP TABLE "cuisine_types" CASCADE;
  DROP TABLE "cuisine_types_locales" CASCADE;
  DROP TABLE "dietary_options" CASCADE;
  DROP TABLE "dietary_options_locales" CASCADE;
  DROP TABLE "seasons" CASCADE;
  DROP TABLE "seasons_locales" CASCADE;
  DROP TABLE "difficulty_levels" CASCADE;
  DROP TABLE "difficulty_levels_locales" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "workflow_history" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer_nav_items_locales" CASCADE;
  DROP TABLE "footer_link_groups_links" CASCADE;
  DROP TABLE "footer_link_groups_links_locales" CASCADE;
  DROP TABLE "footer_link_groups" CASCADE;
  DROP TABLE "footer_link_groups_locales" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  DROP TABLE "footer_social_links_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "main_menu_tabs_nav_items_list_links_links" CASCADE;
  DROP TABLE "main_menu_tabs_nav_items_list_links_links_locales" CASCADE;
  DROP TABLE "main_menu_tabs_nav_items" CASCADE;
  DROP TABLE "main_menu_tabs_nav_items_locales" CASCADE;
  DROP TABLE "main_menu_tabs" CASCADE;
  DROP TABLE "main_menu_tabs_locales" CASCADE;
  DROP TABLE "main_menu" CASCADE;
  DROP TABLE "main_menu_rels" CASCADE;
  DROP TABLE "settings_facet_config" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_hero_nav_theme";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_hero_nav_theme";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_hotels_workflow_status";
  DROP TYPE "public"."enum_hotels_star_rating";
  DROP TYPE "public"."enum_hotels_status";
  DROP TYPE "public"."enum__hotels_v_version_workflow_status";
  DROP TYPE "public"."enum__hotels_v_version_star_rating";
  DROP TYPE "public"."enum__hotels_v_version_status";
  DROP TYPE "public"."enum__hotels_v_published_locale";
  DROP TYPE "public"."enum_restaurants_restaurant_hours_days";
  DROP TYPE "public"."enum_restaurants_workflow_status";
  DROP TYPE "public"."enum_restaurants_status";
  DROP TYPE "public"."enum__restaurants_v_version_restaurant_hours_days";
  DROP TYPE "public"."enum__restaurants_v_version_workflow_status";
  DROP TYPE "public"."enum__restaurants_v_version_status";
  DROP TYPE "public"."enum__restaurants_v_published_locale";
  DROP TYPE "public"."enum_activities_workflow_status";
  DROP TYPE "public"."enum_activities_status";
  DROP TYPE "public"."enum__activities_v_version_workflow_status";
  DROP TYPE "public"."enum__activities_v_version_status";
  DROP TYPE "public"."enum__activities_v_published_locale";
  DROP TYPE "public"."enum_attractions_workflow_status";
  DROP TYPE "public"."enum_attractions_status";
  DROP TYPE "public"."enum__attractions_v_version_workflow_status";
  DROP TYPE "public"."enum__attractions_v_version_status";
  DROP TYPE "public"."enum__attractions_v_published_locale";
  DROP TYPE "public"."enum_events_workflow_status";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_workflow_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum__events_v_published_locale";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_users_keycloak_sync_status";
  DROP TYPE "public"."enum_visitors_language";
  DROP TYPE "public"."enum_newsletter_subscriptions_status";
  DROP TYPE "public"."enum_newsletter_subscriptions_locale";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_workflow_history_from_status";
  DROP TYPE "public"."enum_workflow_history_to_status";
  DROP TYPE "public"."enum_workflow_history_action";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_footer_nav_items_link_type";
  DROP TYPE "public"."enum_footer_link_groups_links_link_type";
  DROP TYPE "public"."enum_footer_social_links_platform";
  DROP TYPE "public"."enum_main_menu_tabs_nav_items_list_links_links_link_type";
  DROP TYPE "public"."enum_main_menu_tabs_link_type";
  DROP TYPE "public"."enum_main_menu_tabs_dropdown_type";
  DROP TYPE "public"."enum_settings_facet_config_facet_key";
  DROP TYPE "public"."enum_settings_facet_config_selection_mode";
  DROP TYPE "public"."enum_settings_facet_config_filter_mode";
  DROP TYPE "public"."enum_settings_newsletter_provider";`)
}
