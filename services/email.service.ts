import nodemailer from 'nodemailer';

const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

/**
 * Envia um e-mail de redefinição de senha.
 * @param to - E-mail do destinatário.
 * @param token - Token de redefinição de senha.
 */
export async function sendPasswordResetEmail(to: string, token: string) {
  // A URL deve apontar para a sua página de redefinição de senha no frontend
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/redefinir-senha?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Redefinição de Senha - LinkedOut',
    html: `      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #2563eb; text-align: center;">Redefinição de Senha</h2>
        <p>Olá,</p>
        <p>Você solicitou a redefinição da sua senha para sua conta no LinkedOut.</p>
        <p>Para continuar, clique no link abaixo ou copie e cole o token na página de redefinição de senha.</p>
        
        <p style="margin-top: 25px;"><strong>Link para redefinição:</strong></p>
        <p><a href="${resetUrl}" style="color: #2563eb; text-decoration: underline; word-break: break-all;">${resetUrl}</a></p>
        
        <p style="margin-top: 25px;"><strong>Ou use este token:</strong></p>
        <p style="background-color: #f3f4f6; border: 1px solid #d1d5db; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all;">
          ${token}
        </p>

        <p style="margin-top: 25px; font-size: 12px; color: #6b7280;">
          Este link e token expirarão em <strong>1 hora</strong>.
        </p>
        <p style="font-size: 12px; color: #6b7280;">
          Se você não solicitou esta alteração, por favor, ignore este e-mail. Sua senha permanecerá a mesma.
        </p>
      </div>
    `,
  };

  // Envia o e-mail apenas UMA VEZ e armazena o resultado
  const info = await transporter.sendMail(mailOptions);

  // Usa o resultado do envio para obter a URL de preview (se aplicável)
  const previewUrl = nodemailer.getTestMessageUrl(info);

  console.log(`E-mail de redefinição de senha enviado para ${to}. ${previewUrl ? `URL de preview: ${previewUrl}` : ''}`);
}
