import mysql from 'mysql2/promise';

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT || 3306);
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

if (!host || !user || !database) {
  console.warn('Database environment is not fully configured. DB_HOST, DB_USER, and DB_NAME are required.');
}

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 5,
  decimalNumbers: true,
});

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (!host || !user || !database) {
    throw new Error('Database environment variables are not configured.');
  }

  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}
