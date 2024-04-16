/*
  Warnings:

  - You are about to drop the column `documentUrl` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `articles` DROP COLUMN `documentUrl`,
    ADD COLUMN `documentFile` VARCHAR(255) NULL;
