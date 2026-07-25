const SENSITIVE_KEYS = ['password', 'jwt', 'token', 'authorization', 'cookie', 'secret', 'passwordHash', 'resetToken'];

function maskSensitiveData(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in copy) {
    if (SENSITIVE_KEYS.some(s => key.toLowerCase().includes(s.toLowerCase()))) {
      copy[key] = '***[MASKED_SECURITY_DATA]***';
    } else if (typeof copy[key] === 'object') {
      copy[key] = maskSensitiveData(copy[key]);
    }
  }
  return copy;
}

export const logger = {
  info(msg, meta = {}) {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({ level: 'INFO', timestamp, msg, meta: maskSensitiveData(meta) }));
  },
  warn(msg, meta = {}) {
    const timestamp = new Date().toISOString();
    console.warn(JSON.stringify({ level: 'WARN', timestamp, msg, meta: maskSensitiveData(meta) }));
  },
  error(msg, meta = {}) {
    const timestamp = new Date().toISOString();
    console.error(JSON.stringify({ level: 'ERROR', timestamp, msg, meta: maskSensitiveData(meta) }));
  }
};
