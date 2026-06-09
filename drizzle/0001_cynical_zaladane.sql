CREATE TABLE "mercadopago_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artwork_id" uuid,
	"preference_id" varchar(255),
	"payment_id" varchar(255),
	"external_reference" varchar(255),
	"buyer_email" varchar(255),
	"buyer_name" varchar(255),
	"amount_ars" numeric(12, 2),
	"amount_usd" numeric(10, 2),
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"instagram" varchar(255),
	"session_type" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"placement" varchar(255),
	"size_approx" varchar(100),
	"reference_image_url" text,
	"additional_notes" text,
	"preferred_date" varchar(100),
	"preferred_time" varchar(100),
	"status" varchar(50) DEFAULT 'pending',
	"admin_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "mercadopago_orders" ADD CONSTRAINT "mercadopago_orders_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE no action ON UPDATE no action;