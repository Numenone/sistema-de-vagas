import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed...');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dbPath = path.join(__dirname, 'db.json');
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  // Limpa as tabelas na ordem correta para evitar conflitos de chave estrangeira
  await prisma.candidatura.deleteMany({});
  await prisma.vaga.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.empresa.deleteMany({});
  console.log('Tabelas limpas.');

  // Insere os dados
  // 1. Empresas
  for (const empresa of dbData.empresas) {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = empresa;
    try {
      await prisma.empresa.create({ data });
    } catch (e) {
      console.error(`Erro ao inserir empresa: ${empresa.nome}`, e);
    }
  }
  console.log('Empresas inseridas.');

  // 2. Usuários
  for (const usuario of dbData.usuarios) {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = usuario;
    try {
      await prisma.usuario.create({ data });
    } catch (e) {
      console.error(`Erro ao inserir usuário: ${usuario.email}`, e);
    }
  }
  console.log('Usuários inseridos.');

  // 3. Habilidades (deve vir antes das Vagas)
  for (const habilidade of dbData.habilidades) {
    const { id: _id, ...data } = habilidade;
    await prisma.habilidade.create({ data });
  }
  console.log('Habilidades inseridas.');

  // 3. Vagas
  for (const vaga of dbData.vagas) {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = vaga;
    try {
      // Provide default values for required enum fields if they are missing
      data.modalidade = data.modalidade || 'REMOTO';
      data.tipoContrato = data.tipoContrato || 'CLT';
      // Garante que o salário é um número
      data.salario = Number(data.salario);
      await prisma.vaga.create({ data });
    } catch (e) {
      console.error(`Erro ao inserir vaga: ${vaga.titulo}`, e);
    }
  }
  console.log('Vagas inseridas.');

  // 4. Candidaturas
  for (const candidatura of dbData.candidaturas) {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = candidatura;
    try {
      // Garante que os IDs são números
      data.usuarioId = Number(data.usuarioId);
      data.vagaId = Number(data.vagaId);
      // Se updatedAt for null, o Prisma usará o valor padrão
      await prisma.candidatura.create({ data });
    } catch (e) {
      console.error(`Erro ao inserir candidatura para vagaId: ${candidatura.vagaId} e usuarioId: ${candidatura.usuarioId}`, e);
    }
  }
  console.log('Candidaturas inseridas.');

  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    if (e instanceof Error) {
      console.error(e);
    } else {
      console.error('Um erro inesperado ocorreu durante o seed:', e);
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });