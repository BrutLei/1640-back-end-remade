-- AlterTable
ALTER TABLE `topic` ADD COLUMN `articlesId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `topic` ADD CONSTRAINT `topic_articlesId_fkey` FOREIGN KEY (`articlesId`) REFERENCES `articles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
