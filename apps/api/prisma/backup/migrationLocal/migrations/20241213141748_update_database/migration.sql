/*
  Warnings:

  - You are about to drop the column `driversId` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `driversId`;

-- AlterTable
ALTER TABLE `users` MODIFY `forgotPasswordToken` VARCHAR(300) NULL;
