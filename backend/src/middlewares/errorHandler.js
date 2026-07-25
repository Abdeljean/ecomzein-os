export function globalErrorHandler(err, req, res, next) {
  console.error('[Nobti Backend Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur'
  });
}
