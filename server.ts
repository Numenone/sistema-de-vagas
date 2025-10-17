import app from './index.ts';

const port = process.env.PORT || 3001;

try {
  app.listen(port, () => {
    console.log(`
    🚀 Server is running!
    🔉 Listening on port ${port}
    `);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}