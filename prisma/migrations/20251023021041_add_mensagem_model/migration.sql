-- AlterTable
ALTER TABLE "Candidatura" ADD COLUMN     "descricao" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Mensagem" (
    "id" SERIAL NOT NULL,
    "conteudo" TEXT NOT NULL,
    "remetenteId" INTEGER NOT NULL,
    "destinatarioId" INTEGER NOT NULL,
    "candidaturaId" INTEGER NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mensagem_remetenteId_idx" ON "Mensagem"("remetenteId");

-- CreateIndex
CREATE INDEX "Mensagem_destinatarioId_idx" ON "Mensagem"("destinatarioId");

-- CreateIndex
CREATE INDEX "Mensagem_candidaturaId_idx" ON "Mensagem"("candidaturaId");
