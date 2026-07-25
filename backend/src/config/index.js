import { env } from './env.js';
import { jwtConfig } from './jwt.js';
import { corsConfig } from './cors.js';

export const config = {
  ...env,
  jwt: jwtConfig,
  cors: corsConfig
};
