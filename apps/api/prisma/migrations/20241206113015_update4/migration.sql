/*
  Warnings:

  - Made the column `discount` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `discount` DOUBLE NOT NULL;
