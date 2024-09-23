/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `cargo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `categoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `credencial` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `status` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `cargo_nome_key` ON `cargo`(`nome`);

-- CreateIndex
CREATE UNIQUE INDEX `categoria_nome_key` ON `categoria`(`nome`);

-- CreateIndex
CREATE UNIQUE INDEX `credencial_email_key` ON `credencial`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `status_nome_key` ON `status`(`nome`);
