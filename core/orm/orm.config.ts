import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import 'dotenv/config';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '../../src/**/*.entity{.ts,.js}')],
  ssl:
    process.env.POSTGRES_SSL === 'enable'
      ? { rejectUnauthorized: false }
      : false,
};
