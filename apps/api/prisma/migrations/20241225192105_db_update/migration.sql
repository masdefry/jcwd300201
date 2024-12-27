/*
  Warnings:

  - Added the required column `paymentMethod` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `paymentMethod` ENUM('MIDTRANS', 'TF_MANUAL') NOT NULL;
