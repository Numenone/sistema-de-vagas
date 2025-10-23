import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Limpar dados existentes na ordem correta para evitar conflitos de chave estrangeira
  await prisma.candidatura.deleteMany();
  await prisma.atividade.deleteMany();
  // A tabela de junção implícita para favoritos e habilidades precisa ser limpa com raw SQL
  await prisma.$executeRaw`DELETE FROM "_VagasFavoritas"`;
  await prisma.$executeRaw`DELETE FROM "_HabilidadeToVaga"`;
  await prisma.vaga.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.habilidade.deleteMany();

  console.log('Cleared existing data.');

  // Criar Habilidades
  const habilidades = await prisma.habilidade.createManyAndReturn({
    data: [
      { nome: 'React' },
      { nome: 'Node.js' },
      { nome: 'TypeScript' },
      { nome: 'Prisma' },
      { nome: 'PostgreSQL' },
      { nome: 'Docker' },
      { nome: 'GraphQL' },
    ],
  });
  console.log('Created skills.');

  // Criar Empresas
  const empresas = await prisma.empresa.createManyAndReturn({
    data: [
      {
        nome: 'Tech Solutions',
        descricao: 'Empresa de tecnologia inovadora focada em desenvolvimento web e mobile.',
        logo: 'https://res.cloudinary.com/dtykejd3r/image/upload/v1726100192/linkedont_empresas/logo-tech-solutions.png',
      },
      {
        nome: 'DevCorp',
        descricao: 'Desenvolvimento de software corporativo e soluções empresariais.',
        logo: 'https://res.cloudinary.com/dtykejd3r/image/upload/v1726100192/linkedont_empresas/logo-devcorp.png',
      },
      {
        nome: 'InovaTech',
        descricao: 'Startup de tecnologia com foco em inteligência artificial.',
        logo: 'https://res.cloudinary.com/dtykejd3r/image/upload/v1726100192/linkedont_empresas/logo-inovatech.png',
      },
    ],
  });
  console.log('Created companies.');

  // Criar Usuários
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash('123456', salt);

  const admin = await prisma.usuario.create({
    data: {
      nome: 'Admin',
      email: 'admin@linkedont.com',
      senha: senhaHash,
      tipo: 'admin',
      fotoPerfil: 'https://res.cloudinary.com/dtykejd3r/image/upload/v1726100191/linkedont_users/user-admin.png',
    },
  });

  const lider = await prisma.usuario.create({
    data: {
      nome: 'Líder Tech',
      email: 'lider@techsolutions.com',
      senha: senhaHash,
      tipo: 'lider',
      empresaId: empresas[0].id,
      fotoPerfil: 'https://res.cloudinary.com/dtykejd3r/image/upload/v1726100191/linkedont_users/user-lider.png',
    },
  });

  const candidato = await prisma.usuario.create({
    data: {
      nome: 'Candidato Dev',
      email: 'candidato@email.com',
      senha: senhaHash,
      tipo: 'candidato',
      fotoPerfil: 'https://res.cloudinary.com/dtykejd3r/image/upload/v1726100191/linkedont_users/user-candidato.png',
    },
  });
  console.log('Created users.');

  // Criar Vagas
  const vaga1 = await prisma.vaga.create({
    data: {
      titulo: 'Desenvolvedor(a) Front-end Pleno',
      descricao: 'Buscamos um(a) desenvolvedor(a) Front-end com experiência em React para se juntar à nossa equipe.',
      requisitos: 'React, TypeScript, Styled-Components, Testes unitários.',
      salario: 7500,
      modalidade: 'Remoto',
      tipoContrato: 'CLT',
      empresaId: empresas[0].id,
      habilidades: {
        connect: [{ id: habilidades[0].id }, { id: habilidades[2].id }],
      },
    },
  });

  const vaga2 = await prisma.vaga.create({
    data: {
      titulo: 'Engenheiro(a) de Software Back-end Sênior',
      descricao: 'Vaga para atuar em projetos de alta complexidade utilizando Node.js e Prisma.',
      requisitos: 'Node.js, Prisma, PostgreSQL, Docker, Arquitetura de microsserviços.',
      salario: 12000,
      modalidade: 'Híbrido',
      tipoContrato: 'PJ',
      empresaId: empresas[1].id,
      habilidades: {
        connect: [{ id: habilidades[1].id }, { id: habilidades[3].id }, { id: habilidades[4].id }, { id: habilidades[5].id }],
      },
    },
  });
  console.log('Created jobs.');

  // Criar Candidaturas
  await prisma.candidatura.createMany({
    data: [
      {
        usuarioId: candidato.id,
        vagaId: vaga1.id,
        descricao: 'Tenho muito interesse na vaga e possuo 3 anos de experiência com React e TypeScript.',
        status: 'Enviada',
      },
    ],
    skipDuplicates: true, // Evita erros se a candidatura já existir
  });
  console.log('Created applications.');

  // Favoritar Vaga
  await prisma.usuario.update({
    where: { id: candidato.id },
    data: {
      vagasFavoritas: {
        connect: { id: vaga2.id },
      },
    },
  });
  console.log('Created favorites.');

  // Criar Atividades
  await prisma.atividade.createMany({
    data: [
      {
        tipo: 'NOVA_VAGA',
        vagaId: vaga1.id,
      },
      {
        tipo: 'NOVA_VAGA',
        vagaId: vaga2.id,
      },
      {
        tipo: 'NOVA_CANDIDATURA',
        usuarioId: candidato.id,
        vagaId: vaga1.id,
      },
    ],
  });
  console.log('Created activities.');

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