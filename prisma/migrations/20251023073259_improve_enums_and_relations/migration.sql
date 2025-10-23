/*
  Warnings:

  - The `status` column on the `Candidatura` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tipo` column on the `Usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `tipo` on the `Atividade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoAtividade" AS ENUM ('NOVA_VAGA', 'NOVA_CANDIDATURA');

-- AlterTable
ALTER TABLE "Atividade" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoAtividade" NOT NULL;

-- AlterTable
ALTER TABLE "Candidatura" DROP COLUMN "status",
ADD COLUMN     "status" "StatusCandidatura" NOT NULL DEFAULT 'Enviada',
ALTER COLUMN "descricao" DROP NOT NULL,
ALTER COLUMN "descricao" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "UserType" NOT NULL DEFAULT 'candidato';
