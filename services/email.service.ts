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
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h2>Redefinição de Senha</h2>
        <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo para continuar:</p>
        <a 
          href="${resetUrl}" 
          style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;"
        >
          Redefinir Senha
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #888;">
          Se você não solicitou isso, por favor, ignore este e-mail.
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
