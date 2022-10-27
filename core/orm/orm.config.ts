import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import 'dotenv/config';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [join(__dirname, '../../src/**/*.entity{.ts,.js}')],
  ssl:
    process.env.MYSQL_SSL === 'enable' ? { rejectUnauthorized: false } : false,
};
