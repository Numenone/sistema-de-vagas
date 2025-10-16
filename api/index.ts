import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Endpoint para buscar vagas (com filtro e pesquisa)
app.get('/api/vagas', async (req, res) => {
  const { q, ativa, _expand } = req.query;
  
  const where: any = {};
  if (ativa === 'true') where.ativa = true;
  if (q) {
    where.OR = [
      { titulo: { contains: q as string, mode: 'insensitive' } },
      { descricao: { contains: q as string, mode: 'insensitive' } },
    ];
  }

  const include: any = {};
  if (_expand === 'empresa') {
    include.empresa = true;
  }

  try {
    const vagas = await prisma.vaga.findMany({ where, include });
    res.json(vagas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vagas' });
  }
});

// Endpoint para buscar uma vaga específica
app.get('/api/vagas/:id', async (req, res) => {
  const { id } = req.params;
  const { _expand } = req.query;
  const include: any = {};
  if (_expand === 'empresa') include.empresa = true;

  try {
    const vaga = await prisma.vaga.findUnique({
      where: { id: Number(id) },
      include,
    });
    if (vaga) {
      res.json(vaga);
    } else {
      res.status(404).json({ error: 'Vaga não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vaga' });
  }
});

// Endpoint para criar vaga
app.post('/api/vagas', async (req, res) => {
  try {
    const novaVaga = await prisma.vaga.create({
      data: {
        ...req.body,
        salario: Number(req.body.salario),
        empresaId: Number(req.body.empresaId),
      },
    });
    res.status(201).json(novaVaga);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar vaga' });
  }
});

// Endpoint para atualizar vaga (PATCH)
app.patch('/api/vagas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const vagaAtualizada = await prisma.vaga.update({
            where: { id: Number(id) },
            data: req.body,
        });
        res.json(vagaAtualizada);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar vaga' });
    }
});

// Endpoint para usuários (login e listagem)
app.get('/api/usuarios', async (req, res) => {
  const { email, senha, tipo } = req.query;
  const where: any = {};
  if (email) where.email = email as string;
  if (senha) where.senha = senha as string;
  if (tipo) where.tipo = tipo as string;

  try {
    const usuarios = await prisma.usuario.findMany({ where });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Endpoint para empresas
app.get('/api/empresas', async (req, res) => {
  try {
    const empresas = await prisma.empresa.findMany();
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar empresas' });
  }
});

// Endpoint para candidaturas
app.get('/api/candidaturas', async (req, res) => {
    const { usuarioId } = req.query;
    const where: any = {};
    if (usuarioId) where.usuarioId = Number(usuarioId);

    try {
        const candidaturas = await prisma.candidatura.findMany({ where });
        res.json(candidaturas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar candidaturas' });
    }
});

app.post('/api/candidaturas', async (req, res) => {
    try {
        const novaCandidatura = await prisma.candidatura.create({ data: req.body });
        res.status(201).json(novaCandidatura);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar candidatura' });
    }
});

app.patch('/api/candidaturas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const candidaturaAtualizada = await prisma.candidatura.update({
            where: { id: Number(id) },
            data: req.body,
        });
        res.json(candidaturaAtualizada);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar candidatura' });
    }
});

// Exporta o app para a Vercel
export default app;