/*
  Warnings:

  - Added the required column `modalidade` to the `Vaga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoContrato` to the `Vaga` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vaga" ADD COLUMN     "modalidade" "ModalidadeEnum" NOT NULL,
ADD COLUMN     "tipoContrato" "TipoContratoEnum" NOT NULL;
