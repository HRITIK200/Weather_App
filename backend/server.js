import app from './src/app.js';
import dotenv from 'dotenv';
import { checkDbConnection } from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Weather API Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);

  const dbOk = await checkDbConnection();
  if (dbOk) {
    console.log(`✅ [database]: PostgreSQL connected.`);
  } else {
    console.log(`ℹ️ [database]: PostgreSQL offline. Using in-memory fallback store.`);
  }
});
