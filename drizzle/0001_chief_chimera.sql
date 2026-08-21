CREATE TABLE `atlasConnections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`domain` enum('health','financial') NOT NULL,
	`provider` varchar(80) NOT NULL,
	`status` enum('needs_credentials','connected','revoked','blocked') NOT NULL DEFAULT 'needs_credentials',
	`encryptedMetadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`revokedAt` timestamp,
	CONSTRAINT `atlasConnections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `atlasConsents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`domain` enum('health','financial') NOT NULL,
	`purpose` varchar(255) NOT NULL,
	`scopesJson` text NOT NULL,
	`consentVersion` varchar(32) NOT NULL,
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `atlasConsents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `atlasSensitiveRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`domain` enum('health','financial') NOT NULL,
	`recordType` varchar(80) NOT NULL,
	`encryptedPayload` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `atlasSensitiveRecords_id` PRIMARY KEY(`id`)
);
