CREATE TABLE "images" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"mime" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memories" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"details" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"objective" text NOT NULL,
	"image_id" text,
	"config" text NOT NULL,
	"prompt" text NOT NULL,
	"negative" text NOT NULL,
	"script" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "images_user" ON "images" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "memories_user_kind" ON "memories" USING btree ("user_id","kind");--> statement-breakpoint
CREATE INDEX "projects_user_created" ON "projects" USING btree ("user_id","created_at");