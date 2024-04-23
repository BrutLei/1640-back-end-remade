/*
  Warnings:

  - You are about to drop the column `title` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `articles` DROP COLUMN `title`,
    ADD COLUMN `comment` VARCHAR(255) NULL,
    ADD COLUMN `shortDescription` VARCHAR(255) NULL;
