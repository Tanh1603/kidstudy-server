import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const sql = postgres({
    host: "localhost",
    port: 5432,
    database: "kidstudy",
    username: "postgres",
    password: "baotuong",
});

const db = drizzle(sql); // Kết nối database với Drizzle ORM

export { db, sql }; // Xuất riêng biệt để dễ dùng
