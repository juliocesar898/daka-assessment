import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { User } from '../auth/entities/user.entity';

/**
 * Configuración central de MikroORM
 *
 * 📖 Documentación: https://mikro-orm.io/docs/usage-with-nestjs
 *
 * ⚠️  TODO (Candidato): Completa esta configuración.
 *     Todos los valores deben provenir de variables de entorno (ver .env.example)
 */
export default defineConfig({
  // ─── Conexión a PostgreSQL ────────────────────────────────────────────────
  host:     process.env.DATABASE_HOST     ?? 'localhost',
  port:     parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  user:     process.env.DATABASE_USER     ?? 'technical-test',
  password: process.env.DATABASE_PASSWORD ?? '',
  dbName:   process.env.DATABASE_NAME     ?? 'technical-test_db',

  // ─── Entidades ────────────────────────────────────────────────────────────
  // TODO: Registra TODAS las entidades que tu solución defina aquí.
  entities: [User],

  // ─── Migraciones ─────────────────────────────────────────────────────────
  // Para crear una migración: npx mikro-orm migration:create
  // Para aplicarla:           npx mikro-orm migration:up
  extensions: [Migrator],
  migrations: {
    path:   './src/migrations',
    pathTs: './src/migrations',
  },

  // ─── Desarrollo ──────────────────────────────────────────────────────────
  // TODO: ¿Por qué NO deberías usar schemaGenerator.updateSchema() en producción?
  debug: process.env.NODE_ENV !== 'production',
});

