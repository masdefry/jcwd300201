/*
  Warnings:

  - Added the required column `userAddress` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `userAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `userAddressId` INTEGER NULL;

-- AlterTable
ALTER TABLE `orderdetail` ADD COLUMN `quantity` INTEGER NULL;

-- AlterTable
ALTER TABLE `orderstatus` ADD COLUMN `workerId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_userAddressId_fkey` FOREIGN KEY (`userAddressId`) REFERENCES `usersAddress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderStatus` ADD CONSTRAINT `orderStatus_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `worker`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
