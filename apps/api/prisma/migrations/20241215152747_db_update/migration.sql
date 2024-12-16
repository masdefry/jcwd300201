-- AlterTable
ALTER TABLE `users` MODIFY `phoneNumber` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `worker` MODIFY `phoneNumber` VARCHAR(20) NOT NULL,
    MODIFY `profilePicture` LONGTEXT NOT NULL,
    MODIFY `identityNumber` LONGTEXT NULL;
