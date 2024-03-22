-- CreateTable
CREATE TABLE `academicyears` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` DATE NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `documentUrl` VARCHAR(255) NULL,
    `submittedDate` DATETIME(0) NULL,
    `reviewStatus` ENUM('Reviewing', 'Approve', 'Reject') NULL,
    `userId` INTEGER NULL,
    `facultyId` INTEGER NULL,
    `academicYearId` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    INDEX `academicYearId`(`academicYearId`),
    INDEX `facultyId`(`facultyId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `closeddates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `closingDate` DATE NULL,
    `academicYearId` INTEGER NULL,
    `facultyId` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    INDEX `academicYearId`(`academicYearId`),
    INDEX `facultyId`(`facultyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faculties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grouproles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupId` INTEGER NULL,
    `roleId` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    INDEX `groupId`(`groupId`),
    INDEX `roleId`(`roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `groupId` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `facultyId` INTEGER NULL,

    INDEX `groupId`(`groupId`),
    INDEX `users_facultyId_fkey`(`facultyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_ibfk_2` FOREIGN KEY (`facultyId`) REFERENCES `faculties`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_ibfk_3` FOREIGN KEY (`academicYearId`) REFERENCES `academicyears`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `closeddates` ADD CONSTRAINT `closeddates_ibfk_1` FOREIGN KEY (`academicYearId`) REFERENCES `academicyears`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `closeddates` ADD CONSTRAINT `closeddates_ibfk_2` FOREIGN KEY (`facultyId`) REFERENCES `faculties`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `grouproles` ADD CONSTRAINT `grouproles_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `grouproles` ADD CONSTRAINT `grouproles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `faculties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
