/*
  Warnings:

  - You are about to drop the column `academicYearId` on the `closeddates` table. All the data in the column will be lost.
  - You are about to drop the column `facultyId` on the `closeddates` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `closeddates` DROP FOREIGN KEY `closeddates_ibfk_1`;

-- DropForeignKey
ALTER TABLE `closeddates` DROP FOREIGN KEY `closeddates_ibfk_2`;

-- AlterTable
ALTER TABLE `closeddates` DROP COLUMN `academicYearId`,
    DROP COLUMN `facultyId`;
