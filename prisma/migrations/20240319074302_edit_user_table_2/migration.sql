/*
  Warnings:

  - You are about to drop the `userfaculties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userfaculties` DROP FOREIGN KEY `userfaculties_ibfk_1`;

-- DropForeignKey
ALTER TABLE `userfaculties` DROP FOREIGN KEY `userfaculties_ibfk_2`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `facultyId` INTEGER NULL;

-- DropTable
DROP TABLE `userfaculties`;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `faculties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
