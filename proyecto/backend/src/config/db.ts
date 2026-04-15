import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

export default pool;