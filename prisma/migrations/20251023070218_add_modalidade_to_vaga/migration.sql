-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('candidato', 'lider', 'admin');

-- CreateEnum
CREATE TYPE "ModalidadeEnum" AS ENUM ('REMOTO', 'HIBRIDO', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "TipoContratoEnum" AS ENUM ('CLT', 'PJ');

-- CreateEnum
CREATE TYPE "StatusCandidatura" AS ENUM ('Enviada', 'Em_Análise', 'Aprovada', 'Rejeitada');
