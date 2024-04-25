-- AlterTable
ALTER TABLE `closeddates` ADD COLUMN `topicId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `closeddates` ADD CONSTRAINT `closeddates_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `topic`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
