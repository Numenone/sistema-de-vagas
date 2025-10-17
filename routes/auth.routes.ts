import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken } from '../middlewares/auth.middleware';
import crypto from 'crypto'; // Adicionado para o forgot-password

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO';

// --- Cloudinary/Multer Config (específico para este router) ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'SEU_CLOUD_NAME',
  api_key: process.env.CLOUDINARY_API_KEY || 'SUA_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'SEU_API_SECRET'
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'linkedont_users', allowed_formats: ['jpg', 'png', 'jpeg'] } as any,
});
const upload = multer({ storage });

// --- Rotas de Autenticação e Usuário ---

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(401).json({ error: 'Email ou senha incorretos.' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ error: 'Email ou senha incorretos.' });

    const { senha: _, ...usuarioParaToken } = usuario;
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, empresaId: usuario.empresaId },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, usuario: usuarioParaToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

router.post('/usuarios', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  if (!nome || !email || !senha || !tipo) return res.status(400).json({ error: 'Todos os campos são obrigatórios' });

  try {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash, tipo },
    });
    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json(usuarioSemSenha);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.patch('/usuarios/:id', authenticateToken, upload.single('fotoPerfil'), async (req, res) => {
    const { id } = req.params;
    const { nome, senha } = req.body;

    if (req.usuario?.id !== Number(id)) return res.status(403).json({ error: 'Acesso negado' });

    const dataToUpdate: any = {};
    if (nome) dataToUpdate.nome = nome;
    if (senha) dataToUpdate.senha = await bcrypt.hash(senha, await bcrypt.genSalt(10));
    if (req.file) dataToUpdate.fotoPerfil = req.file.path;

    try {
        const usuarioAtualizado = await prisma.usuario.update({
            where: { id: Number(id) },
            data: dataToUpdate,
        });
        const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;
        res.json(usuarioSemSenha);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao atualizar usuário' });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório.' });

    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });

        // Gera um token de redefinição de senha
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora

        await prisma.usuario.update({
            where: { id: usuario.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetPasswordExpires,
            },
        });

        // TODO: Implementar o envio de e-mail com o link de redefinição
        // Ex: const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
        // await sendEmail(usuario.email, 'Redefinição de Senha', `Clique aqui para redefinir sua senha: ${resetUrl}`);

        console.log(`Token de redefinição para ${usuario.email}: ${resetToken}`); // Apenas para debug
        res.status(200).json({ message: 'Link de redefinição de senha enviado para o seu e-mail (verifique o console para o token).' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao solicitar redefinição de senha.' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, senha } = req.body;
    if (!token || !senha) return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });

    try {
        const usuario = await prisma.usuario.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gte: new Date() },
            },
        });

        if (!usuario) return res.status(400).json({ error: 'Token inválido ou expirado.' });

        const senhaHash = await bcrypt.hash(senha, await bcrypt.genSalt(10));
        await prisma.usuario.update({
            where: { id: usuario.id },
            data: {
                senha: senhaHash,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
        res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao redefinir senha.' });
    }
});

export default router;