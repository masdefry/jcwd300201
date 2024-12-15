/*
  Warnings:

  - You are about to drop the column `isProcessed` on the `orderstatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `isProcessed` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `orderstatus` DROP COLUMN `isProcessed`;
