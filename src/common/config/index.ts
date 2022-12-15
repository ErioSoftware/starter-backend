import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  errorCodes: {
    DUP_KEY: 'DUP_KEY',
    VIO_FK: 'VIO_FK',
    UNK_ERR: 'UNK_ERR',
  },
};

const baseDBConfig = {
  host: 'postgres',
  port: 5432,
  username: 'user',
  password: 'pass',
  database: 'db',
  autoLoadEntities: true,
};

const prodDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  ...baseDBConfig,
};

const devDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  ...baseDBConfig,
  synchronize: true,
};

export const dbConfig =
  process.env.PRODUCTION === 'true' ? prodDatabaseConfig : devDatabaseConfig;
