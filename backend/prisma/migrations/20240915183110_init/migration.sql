-- DropForeignKey
ALTER TABLE `relato` DROP FOREIGN KEY `relato_usuarioId_fkey`;

-- AlterTable
ALTER TABLE `relato` MODIFY `usuarioId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `relato` ADD CONSTRAINT `relato_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
