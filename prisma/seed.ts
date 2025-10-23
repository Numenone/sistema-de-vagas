import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import path from 'path';
import * as usuarioService from '../services/usuario.service';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Limpa as tabelas na ordem correta para evitar conflitos de chave estrangeira
  await prisma.mensagem.deleteMany({});
  await prisma.candidatura.deleteMany();
  await prisma.atividade.deleteMany();
  // Limpa tabelas de junção implícitas
  if ((prisma as any)._executeRawUnsafe) { // Verifica se o método existe para evitar erros com versões diferentes
    await (prisma as any)._executeRawUnsafe(`DELETE FROM "_VagasFavoritas"`);
    await (prisma as any)._executeRawUnsafe(`DELETE FROM "_HabilidadeToVaga"`);
  }
  await prisma.vaga.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.habilidade.deleteMany();
  console.log('Cleared existing data.');

  const dbPath = path.join(__dirname, '..', 'db.json');
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  // 1. Empresas
  for (const empresa of dbData.empresas) {
    const { id: _id, ...data } = empresa;
    await prisma.empresa.create({ data });
  }
  console.log('Empresas inseridas.');

  // 2. Usuários (com hash de senha)
  for (const usuario of dbData.usuarios) {
    const { id: _id, senha, ...data } = usuario;
    await usuarioService.create({ ...data, senha });
  }
  console.log('Usuários inseridos.');

  // 3. Habilidades (deve vir antes das Vagas)
  for (const habilidade of dbData.habilidades) {
    const { id: _id, ...data } = habilidade;
    await prisma.habilidade.create({ data });
  }
  console.log('Habilidades inseridas.');

  // 3. Habilidades (deve vir antes das Vagas)
  for (const habilidade of dbData.habilidades) {
    const { id: _id, ...data } = habilidade;
    await prisma.habilidade.create({ data });
  }
  console.log('Habilidades inseridas.');

  // 3. Vagas
  for (const vaga of dbData.vagas) {
    const { id: _id, ...data } = vaga;
    // Adiciona valores padrão para campos que não estão no db.json
    data.modalidade = data.modalidade || 'REMOTO'; // Use a valid enum value as default
    data.tipoContrato = data.tipoContrato || 'CLT'; // Use a valid enum value as default
    await prisma.vaga.create({ data });
  }
  console.log('Vagas inseridas.');

  // 4. Candidaturas
  for (const candidatura of dbData.candidaturas) {
    const { id: _id, ...data } = candidatura;
    // Garante que o status seja um dos valores válidos ou um padrão
    const validStatus = ['Enviada', 'Em Análise', 'Aprovada', 'Rejeitada'].includes(data.status) ? data.status : 'Enviada';
    data.status = validStatus;
    await prisma.candidatura.create({ data });
  }
  console.log('Candidaturas inseridas.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });