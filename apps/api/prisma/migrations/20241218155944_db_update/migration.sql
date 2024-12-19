/*
  Warnings:

  - You are about to alter the column `phoneNumber` on the `contacts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE `contacts` MODIFY `phoneNumber` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `profilePicture` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `usersaddresses` MODIFY `addressDetail` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `workers` MODIFY `profilePicture` VARCHAR(255) NOT NULL;
