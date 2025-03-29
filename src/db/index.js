import dotenv from 'dotenv'
import {drizzle} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "./schema.js";

dotenv.config({ path: '.env.development' })

const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(sql, { schema });

export default db;
