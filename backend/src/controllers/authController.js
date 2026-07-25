import * as authService from '../services/authService.js';
import { config } from '../config/index.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.loginUser(email, password);

    // Set HttpOnly, Secure, SameSite=Lax Cookies for Production Security
    const isProd = config.nodeEnv === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 min
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return res.json({
      status: 'success',
      accessToken,
      user
    });
  } catch (err) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
  }
}

export async function logout(req, res) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ status: 'success', message: 'Déconnexion réussie.' });
}

export async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authService.requestReset(email);
    return res.json({
      status: 'success',
      message: `Jeton de réinitialisation sécurisé envoyé à ${email}`,
      rawToken: result.rawToken
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    await authService.resetUserPassword(token, newPassword);
    return res.json({ status: 'success', message: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    return res.status(400).json({ error: 'Jeton de réinitialisation invalide ou expiré.' });
  }
}

export async function getMe(req, res) {
  return res.json({ user: req.user });
}
