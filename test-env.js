import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env.local
dotenv.config({ path: path.resolve('./.env.local') });

console.log("DATABASE_URL =", process.env.DATABASE_URL);
