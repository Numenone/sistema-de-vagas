-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "fotoPerfil" TEXT,
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;

-- AlterTable
ALTER TABLE "Vaga" ADD COLUMN     "modalidade" TEXT NOT NULL DEFAULT 'Presencial',
ADD COLUMN     "tipoContrato" TEXT NOT NULL DEFAULT 'CLT';

-- CreateTable
CREATE TABLE "Habilidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Habilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VagasFavoritas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VagasFavoritas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HabilidadeToVaga" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_HabilidadeToVaga_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Habilidade_nome_key" ON "Habilidade"("nome");

-- CreateIndex
CREATE INDEX "_VagasFavoritas_B_index" ON "_VagasFavoritas"("B");

-- CreateIndex
CREATE INDEX "_HabilidadeToVaga_B_index" ON "_HabilidadeToVaga"("B");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VagasFavoritas" ADD CONSTRAINT "_VagasFavoritas_A_fkey" FOREIGN KEY ("A") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VagasFavoritas" ADD CONSTRAINT "_VagasFavoritas_B_fkey" FOREIGN KEY ("B") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HabilidadeToVaga" ADD CONSTRAINT "_HabilidadeToVaga_A_fkey" FOREIGN KEY ("A") REFERENCES "Habilidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HabilidadeToVaga" ADD CONSTRAINT "_HabilidadeToVaga_B_fkey" FOREIGN KEY ("B") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
