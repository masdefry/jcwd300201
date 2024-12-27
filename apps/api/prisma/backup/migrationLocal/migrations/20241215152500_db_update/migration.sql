-- AlterTable
ALTER TABLE `order` ADD COLUMN `isProcessed` BOOLEAN NULL,
    ADD COLUMN `isSolved` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `worker` MODIFY `changePasswordToken` VARCHAR(500) NULL;
