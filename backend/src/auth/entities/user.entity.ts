import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

/**
 * Entidad User — MikroORM
 *
 * Esta entidad es la referencia base provista por Daka.
 * El candidato debe extenderla según los requisitos de la prueba.
 *
 * 📖 Decoradores: https://mikro-orm.io/docs/decorators
 */
@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  username!: string;

  /**
   * ⚠️  TODO (Candidato — OWASP A02): Este campo NO debe almacenarse en texto plano.
   * Consulta OWASP_REQUIREMENTS.md — sección "Gestión de Contraseñas".
   * Usa bcrypt con un cost factor apropiado antes de persistir.
   */
  @Property()
  password!: string;

  // TODO: ¿Qué otros campos necesita tu modelo de usuario?
  // Ejemplo: createdAt, updatedAt, email, refreshToken, roles, etc.
}

