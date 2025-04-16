/*
  Warnings:

  - You are about to drop the column `contractId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `bidAmount` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the column `freelancerId` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Contract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Milestone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resume` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gigId` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeline` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Contract` DROP FOREIGN KEY `Contract_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `Contract` DROP FOREIGN KEY `Contract_freelancerId_fkey`;

-- DropForeignKey
ALTER TABLE `Contract` DROP FOREIGN KEY `Contract_jobId_fkey`;

-- DropForeignKey
ALTER TABLE `Contract` DROP FOREIGN KEY `Contract_proposalId_fkey`;

-- DropForeignKey
ALTER TABLE `Job` DROP FOREIGN KEY `Job_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_contractId_fkey`;

-- DropForeignKey
ALTER TABLE `Milestone` DROP FOREIGN KEY `Milestone_contractId_fkey`;

-- DropForeignKey
ALTER TABLE `Proposal` DROP FOREIGN KEY `Proposal_freelancerId_fkey`;

-- DropForeignKey
ALTER TABLE `Proposal` DROP FOREIGN KEY `Proposal_jobId_fkey`;

-- DropForeignKey
ALTER TABLE `Resume` DROP FOREIGN KEY `Resume_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_contractId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_revieweeId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_reviewerId_fkey`;

-- AlterTable
ALTER TABLE `Message` DROP COLUMN `contractId`,
    ADD COLUMN `receiverId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Proposal` DROP COLUMN `bidAmount`,
    DROP COLUMN `feedback`,
    DROP COLUMN `freelancerId`,
    DROP COLUMN `jobId`,
    ADD COLUMN `gigId` VARCHAR(191) NOT NULL,
    ADD COLUMN `portfolioId` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` DOUBLE NOT NULL,
    ADD COLUMN `timeline` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `coverLetter` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `password`,
    DROP COLUMN `portfolio`,
    DROP COLUMN `rate`,
    ADD COLUMN `emailVerified` DATETIME(3) NULL,
    ADD COLUMN `hourlyRate` DOUBLE NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `role` ENUM('CLIENT', 'FREELANCER', 'ADMIN') NOT NULL DEFAULT 'CLIENT',
    MODIFY `skills` TEXT NULL;

-- DropTable
DROP TABLE `Contract`;

-- DropTable
DROP TABLE `Job`;

-- DropTable
DROP TABLE `Milestone`;

-- DropTable
DROP TABLE `Resume`;

-- DropTable
DROP TABLE `Review`;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gig` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `budget` DOUBLE NOT NULL,
    `timeline` VARCHAR(191) NOT NULL,
    `skills` TEXT NOT NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `selectedProposalId` VARCHAR(191) NULL,

    UNIQUE INDEX `Gig_selectedProposalId_key`(`selectedProposalId`),
    INDEX `Gig_clientId_idx`(`clientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Portfolio` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `images` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `Portfolio_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Meeting` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `meetingUrl` VARCHAR(191) NULL,
    `boardUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `Meeting_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Progress` (
    `id` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `percentage` INTEGER NOT NULL,
    `files` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gigId` VARCHAR(191) NOT NULL,

    INDEX `Progress_gigId_idx`(`gigId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `type` ENUM('ADVANCE', 'FINAL', 'MILESTONE') NOT NULL,
    `razorpayId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `freelancerId` VARCHAR(191) NOT NULL,

    INDEX `Payment_userId_idx`(`userId`),
    INDEX `Payment_freelancerId_idx`(`freelancerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Message_receiverId_idx` ON `Message`(`receiverId`);

-- CreateIndex
CREATE INDEX `Proposal_userId_idx` ON `Proposal`(`userId`);

-- CreateIndex
CREATE INDEX `Proposal_gigId_idx` ON `Proposal`(`gigId`);

-- CreateIndex
CREATE INDEX `Proposal_portfolioId_idx` ON `Proposal`(`portfolioId`);

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gig` ADD CONSTRAINT `Gig_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gig` ADD CONSTRAINT `Gig_selectedProposalId_fkey` FOREIGN KEY (`selectedProposalId`) REFERENCES `Proposal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Portfolio` ADD CONSTRAINT `Portfolio_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proposal` ADD CONSTRAINT `Proposal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proposal` ADD CONSTRAINT `Proposal_gigId_fkey` FOREIGN KEY (`gigId`) REFERENCES `Gig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proposal` ADD CONSTRAINT `Proposal_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `Portfolio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Meeting` ADD CONSTRAINT `Meeting_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progress` ADD CONSTRAINT `Progress_gigId_fkey` FOREIGN KEY (`gigId`) REFERENCES `Gig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_freelancerId_fkey` FOREIGN KEY (`freelancerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Message` RENAME INDEX `Message_senderId_fkey` TO `Message_senderId_idx`;
