import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed...');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dbPath = path.join(__dirname, '..', 'db.json');
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  // Limpa as tabelas na ordem correta para evitar conflitos de chave estrangeira
  await prisma.candidatura.deleteMany({});
  await prisma.vaga.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.empresa.deleteMany({});
  console.log('Tabelas limpas.');

  // Insere os dados
  for (const empresa of dbData.empresas) {
    await prisma.empresa.create({ data: empresa });
  }
  console.log('Empresas inseridas.');

  for (const usuario of dbData.usuarios) {
    await prisma.usuario.create({ data: usuario });
  }
  console.log('Usuários inseridos.');

  for (const vaga of dbData.vagas) {
    // Converte salario para Float se for string
    if (typeof vaga.salario === 'string') {
      vaga.salario = parseFloat(vaga.salario);
    }
    await prisma.vaga.create({ data: vaga });
  }
  console.log('Vagas inseridas.');

  for (const candidatura of dbData.candidaturas) {
    // Garante que os IDs são números
    candidatura.usuarioId = Number(candidatura.usuarioId);
    candidatura.vagaId = Number(candidatura.vagaId);
    await prisma.candidatura.create({ data: candidatura });
  }
  console.log('Candidaturas inseridas.');

  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });