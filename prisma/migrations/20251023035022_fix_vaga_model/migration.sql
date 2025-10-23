/*
  Warnings:

  - You are about to drop the column `modalidade` on the `Vaga` table. All the data in the column will be lost.
  - You are about to drop the column `tipoContrato` on the `Vaga` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vaga" DROP COLUMN "modalidade",
DROP COLUMN "tipoContrato";
