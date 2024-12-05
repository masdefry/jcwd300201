/*
  Warnings:

  - You are about to drop the column `isDiscountUsed` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `birtDate` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `isDiscountUsed`,
    MODIFY `paymentProof` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `birtDate`,
    ADD COLUMN `isDiscountUsed` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `verifyCode` VARCHAR(191) NULL,
    MODIFY `forgotPasswordToken` VARCHAR(191) NULL;
