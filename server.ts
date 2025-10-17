import app from './index.ts';

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`
  🚀 Server is running!
  🔉 Listening on port ${port}
  `);
});