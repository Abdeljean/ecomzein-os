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
  const isProd = config.nodeEnv === 'production';
  const cookieOpts = { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/' };
  res.clearCookie('accessToken', cookieOpts);
  res.clearCookie('refreshToken', cookieOpts);
  return res.json({ status: 'success', message: 'Déconnexion réussie.' });
}

export async function refreshToken(req, res, next) {
  try {
    let token = req.cookies ? req.cookies.refreshToken : null;
    if (!token && req.body && req.body.refreshToken) {
      token = req.body.refreshToken;
    }

    if (!token) {
      return res.status(401).json({ error: 'Jeton de rafraîchissement manquant.' });
    }

    const { accessToken, refreshToken: newRefreshToken, user } = await authService.refreshUserToken(token);
    const isProd = config.nodeEnv === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000 // 15 min
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return res.json({
      status: 'success',
      accessToken,
      user
    });
  } catch (err) {
    return res.status(401).json({ error: err.message || 'Jeton de rafraîchissement invalide ou expiré.' });
  }
}

export async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;
    await authService.requestReset(email);
    return res.json({
      status: 'success',
      message: 'Si cette adresse existe, les instructions de réinitialisation ont été envoyées.'
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
