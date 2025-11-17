import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  type: 'postgress',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  pass: process.env.DB_PASS,
  database: process.env.DB_NAME,

  synchronize: process.env.NODE_ENV === 'development',
}));
