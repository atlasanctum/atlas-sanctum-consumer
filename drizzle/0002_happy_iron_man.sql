CREATE TABLE `atlasBriefPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dailyEnabled` boolean NOT NULL DEFAULT false,
	`dailyHour` int NOT NULL DEFAULT 8,
	`dailyMinute` int NOT NULL DEFAULT 0,
	`weeklyEnabled` boolean NOT NULL DEFAULT false,
	`weeklyWeekday` int NOT NULL DEFAULT 1,
	`weeklyHour` int NOT NULL DEFAULT 9,
	`weeklyMinute` int NOT NULL DEFAULT 0,
	`notificationEnabled` boolean NOT NULL DEFAULT false,
	`digestMode` boolean NOT NULL DEFAULT true,
	`dailyTaskUid` varchar(65),
	`weeklyTaskUid` varchar(65),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `atlasBriefPreferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `atlasBriefRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cadence` enum('daily','weekly') NOT NULL,
	`summary` text NOT NULL,
	`source` varchar(64) NOT NULL DEFAULT 'atlas-life-os',
	`deliveredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `atlasBriefRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `atlasLifeSnapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`version` varchar(24) NOT NULL DEFAULT 'v1',
	`payloadJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `atlasLifeSnapshots_id` PRIMARY KEY(`id`)
);
