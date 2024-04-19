import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: +(process.env.DB_PORT || 35432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
});
