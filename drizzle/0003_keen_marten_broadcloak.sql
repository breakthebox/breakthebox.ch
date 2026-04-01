CREATE TABLE "blog_post_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"session_hash" text NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "content_blocks" jsonb;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "seo_score" integer;--> statement-breakpoint
ALTER TABLE "blog_post_views" ADD CONSTRAINT "blog_post_views_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;