import { DataSource } from 'typeorm';
import { join } from 'path';
import 'dotenv/config';

export default new DataSource({
  type: 'mariadb',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [join(__dirname, '../../src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../../src/migrations/*{.ts,.js}')],
});
