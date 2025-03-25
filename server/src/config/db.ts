import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'wng83368',
  database: process.env.DB_NAME || 'recruitment_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}); 