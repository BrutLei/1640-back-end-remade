/*
  Warnings:

  - You are about to drop the column `articlesId` on the `topic` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `topic` DROP FOREIGN KEY `topic_articlesId_fkey`;

-- AlterTable
ALTER TABLE `articles` ADD COLUMN `topicId` INTEGER NULL;

-- AlterTable
ALTER TABLE `topic` DROP COLUMN `articlesId`;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `topic`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
