// Fail-Safe Universal Server Launcher (CommonJS & ESM Compatible for Hostinger Passenger)
(async () => {
  try {
    const appModule = await import('./backend/src/app.js');
    const app = appModule.default;
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`🚀 EcomZein OS Application running on port ${port}`);
    });
  } catch (err) {
    console.error('Fatal server startup error:', err);
    // Express fallback for static index.html if backend ESM load fails
    try {
      const express = (await import('express')).default;
      const path = (await import('path')).default;
      const fallbackApp = express();
      const rootDir = process.cwd();
      fallbackApp.use(express.static(rootDir));
      fallbackApp.get('*', (req, res) => res.sendFile(path.join(rootDir, 'index.html')));
      const fallbackPort = process.env.PORT || 5000;
      fallbackApp.listen(fallbackPort);
    } catch (fallbackErr) {
      console.error('Fallback server error:', fallbackErr);
    }
  }
})();
