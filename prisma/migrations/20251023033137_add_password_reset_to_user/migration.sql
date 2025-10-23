/*
  Warnings:

  - You are about to drop the column `resetPasswordExpires` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "resetPasswordExpires",
DROP COLUMN "resetPasswordToken",
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;
