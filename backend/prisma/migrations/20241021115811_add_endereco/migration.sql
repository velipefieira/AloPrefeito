/*
  Warnings:

  - Added the required column `endereco` to the `relato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `relato` ADD COLUMN `endereco` VARCHAR(191) NOT NULL;
