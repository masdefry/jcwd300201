-- AlterTable
ALTER TABLE `orders` ADD COLUMN `paymentMethod` ENUM('MIDTRANS', 'TF_MANUAL') NULL;
