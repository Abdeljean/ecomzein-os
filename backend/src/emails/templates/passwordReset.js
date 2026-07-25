export function renderPasswordResetEmail(resetUrl, resetToken) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1F2937;">
      <h2 style="color: #2563EB;">Réinitialisation de votre mot de passe - Nobti CRM</h2>
      <p>Bonjour,</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Ecom Zein / Nobti CRM.</p>
      <p>Voici votre code de réinitialisation sécurisé : <strong>${resetToken}</strong></p>
      <p style="margin: 20px 0;">
        <a href="${resetUrl}" style="background: #2563EB; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Réinitialiser mon mot de passe</a>
      </p>
      <p style="font-size: 0.8rem; color: #64748B;">Ce lien est valable pendant 60 minutes.</p>
    </div>
  `;
}
