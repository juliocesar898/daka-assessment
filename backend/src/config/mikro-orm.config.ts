import { config } from 'dotenv';
config(); // 👈 Fuerza la lectura del archivo .env al inicio

import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { User } from '../auth/entities/user.entity';

/**
 * Configuración central de MikroORM
 */
export default defineConfig({
  // Conexión a PostgreSQL
  host: process.env.DATABASE_HOST ?? 'db',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  user: process.env.DATABASE_USER ?? 'technical-test',
  password: process.env.DATABASE_PASSWORD ?? 'technical-test-pass',
  dbName: process.env.DATABASE_NAME ?? 'technical-test_db',

  // Entidades
  entities: [User],

  // Migraciones
  extensions: [Migrator],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },

  // Desarrollo
  debug: process.env.NODE_ENV !== 'production',
});