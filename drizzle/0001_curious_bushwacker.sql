CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`url` text NOT NULL,
	`thumbnail_url` text,
	`type` text DEFAULT 'image' NOT NULL,
	`section` text DEFAULT 'general' NOT NULL,
	`description` text,
	`order_index` integer DEFAULT 0,
	`is_published` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `navigation_items` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`description` text,
	`href` text NOT NULL,
	`icon` text DEFAULT 'flower' NOT NULL,
	`order_index` integer DEFAULT 0,
	`is_visible` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_settings_key_unique` ON `site_settings` (`key`);