/*
  Warnings:

  - You are about to drop the column `descricao` on the `Candidatura` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioId,vagaId]` on the table `Candidatura` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Candidatura" DROP CONSTRAINT "Candidatura_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Candidatura" DROP CONSTRAINT "Candidatura_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vaga" DROP CONSTRAINT "Vaga_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_HabilidadeToVaga" DROP CONSTRAINT "_HabilidadeToVaga_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_HabilidadeToVaga" DROP CONSTRAINT "_HabilidadeToVaga_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_VagasFavoritas" DROP CONSTRAINT "_VagasFavoritas_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_VagasFavoritas" DROP CONSTRAINT "_VagasFavoritas_B_fkey";

-- AlterTable
ALTER TABLE "Candidatura" DROP COLUMN "descricao",
ALTER COLUMN "status" SET DEFAULT 'Enviada';

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "logo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Vaga" ALTER COLUMN "modalidade" DROP DEFAULT,
ALTER COLUMN "tipoContrato" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Atividade" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "usuarioId" INTEGER,
    "vagaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Atividade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Atividade_usuarioId_idx" ON "Atividade"("usuarioId");

-- CreateIndex
CREATE INDEX "Atividade_vagaId_idx" ON "Atividade"("vagaId");

-- CreateIndex
CREATE INDEX "Candidatura_usuarioId_idx" ON "Candidatura"("usuarioId");

-- CreateIndex
CREATE INDEX "Candidatura_vagaId_idx" ON "Candidatura"("vagaId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidatura_usuarioId_vagaId_key" ON "Candidatura"("usuarioId", "vagaId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nome_key" ON "Empresa"("nome");

-- CreateIndex
CREATE INDEX "Usuario_empresaId_idx" ON "Usuario"("empresaId");

-- CreateIndex
CREATE INDEX "Vaga_empresaId_idx" ON "Vaga"("empresaId");
