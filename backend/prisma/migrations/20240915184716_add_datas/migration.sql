/*
  Warnings:

  - Added the required column `data_inicio` to the `relato` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comentario` DROP FOREIGN KEY `comentario_relatoId_fkey`;

-- AlterTable
ALTER TABLE `comentario` MODIFY `relatoId` INTEGER NULL;

-- AlterTable
ALTER TABLE `relato` ADD COLUMN `data_final` DATETIME(3) NULL,
    ADD COLUMN `data_inicio` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `comentario` ADD CONSTRAINT `comentario_relatoId_fkey` FOREIGN KEY (`relatoId`) REFERENCES `relato`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
