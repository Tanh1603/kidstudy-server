// import dotenv from 'dotenv'
// import {drizzle} from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import * as schema from "./schema.js";

// dotenv.config({ path: '.env.development' })

// const sql = postgres(process.env.DATABASE_URL, { max: 1 });
// const db = drizzle(sql, { schema });

// export default db;

import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

dotenv.config({ path: ".env.development" });

// Tái sử dụng connection pool global để tránh reconnect mỗi lần cold start
let sql;

if (!globalThis.__sqlClient) {
  globalThis.__sqlClient = postgres(process.env.DATABASE_URL, {
    max: 10, // số kết nối tối đa (tùy chỉnh theo tải app)
    min: 2,
    ssl: {
      rejectUnauthorized: false, // neon thường yêu cầu ssl, bỏ kiểm tra cert
    },
    idle_timeout: 30000, // 60 giây timeout idle connection
    connect_timeout: 5000,
    prepare: true,
    keep_alive: true,
    onnotice:
      process.env.NODE_ENV === "development"
        ? (msg) => console.log("PG Notice:", msg)
        : () => {},
    onconnect:
      process.env.NODE_ENV === "development"
        ? () => console.log("PG Connected")
        : () => {},
  });

  if (typeof process !== "undefined") {
    process.on("SIGINT", async () => {
      await globalThis.__sqlClient.end();
      process.exit(0);
    });
    process.on("SIGTERM", async () => {
      await globalThis.__sqlClient.end();
      process.exit(0);
    });
  }
}

sql = globalThis.__sqlClient;

const db = drizzle(sql, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
export { db, sql, schema };
export default db;
