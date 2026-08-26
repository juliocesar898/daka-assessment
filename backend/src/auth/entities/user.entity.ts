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
  @Property()
  password!: string;
}

