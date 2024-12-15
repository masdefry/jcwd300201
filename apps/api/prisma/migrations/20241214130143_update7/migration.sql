/*
  Warnings:

  - You are about to drop the column `driversId` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `driversId`,
    ADD COLUMN `isSolved` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `orderstatus` ADD COLUMN `isProcessed` BOOLEAN NULL;
