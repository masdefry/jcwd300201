/*
  Warnings:

  - You are about to drop the column `userAddress` on the `order` table. All the data in the column will be lost.
  - Added the required column `isMain` to the `usersAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `userAddress`,
    MODIFY `totalPrice` INTEGER NULL,
    MODIFY `totalWeight` INTEGER NULL,
    MODIFY `discount` DOUBLE NULL;

-- AlterTable
ALTER TABLE `usersaddress` ADD COLUMN `isMain` BOOLEAN NOT NULL;
