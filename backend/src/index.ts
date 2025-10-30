import { createApp } from './app.js';

const port = Number(process.env.PORT || 4000);

(async () => {
  try {
    const app = await createApp();
    app.listen(port, () => console.log(`Highway API listening on http://localhost:${port}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
