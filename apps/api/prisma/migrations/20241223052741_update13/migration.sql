/*
  Warnings:

  - You are about to drop the column `Price` on the `ordertypes` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `ordertypes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `laundryPrice` INTEGER NULL;

-- AlterTable
ALTER TABLE `ordertypes` DROP COLUMN `Price`,
    DROP COLUMN `Type`,
    ADD COLUMN `price` INTEGER NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;
