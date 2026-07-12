import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { envConfig } from '../config/config.js';
import { PrismaPg } from '@prisma/adapter-pg';
const pool = new Pool({
    connectionString: envConfig.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
    adapter,
});
export default prisma;
