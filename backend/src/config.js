import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'nobti_zein_super_secret_jwt_key_2026',
  jwtExpiresIn: '24h',
  corsOrigin: process.env.CORS_ORIGIN || 'https://tassnimproduct.shop'
};
