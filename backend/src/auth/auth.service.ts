import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

/**
 * AuthService — Scaffold MikroORM
 *
 * ⚠️  INSTRUCCIONES PARA EL CANDIDATO:
 *   Implementa los tres métodos marcados con TODO.
 *   Los seed tests (auth.service.spec.ts) validan tu implementación.
 *
 * Diferencia clave TypeORM → MikroORM:
 *   - TypeORM:  @InjectRepository(User) + Repository<User>
 *   - MikroORM: @InjectRepository(User) + EntityRepository<User>
 *               También puedes inyectar EntityManager directamente.
 *
 * 📖 https://mikro-orm.io/docs/usage-with-nestjs#repositories
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // ═══════════════════════════════════════════════════════
  // TODO: Implementar método de registro
  //
  // Requisitos (OWASP A02 + A07):
  //   1. Verificar que el username no exista ya en la DB
  //      → Lanzar ConflictException si existe
  //   2. Hashear la contraseña con bcrypt (salt rounds >= 10)
  //      → NUNCA almacenar en texto plano
  //   3. Crear y persistir el usuario con MikroORM
  //      → Hint: userRepository.create() + persistAndFlush()
  //   4. Retornar un mensaje de confirmación
  //
  // MikroORM API:
  //   const existing = await this.userRepository.findOne({ username });
  //   const user = this.userRepository.create({ username, password: hashed });
  //   await this.userRepository.persistAndFlush(user);
  // ═══════════════════════════════════════════════════════
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    throw new Error('Method not implemented — Complete this functionality');
  }

  // ═══════════════════════════════════════════════════════
  // TODO: Implementar método de login
  //
  // Requisitos:
  //   1. Buscar el usuario por username
  //      → Lanzar UnauthorizedException si no existe
  //   2. Verificar la contraseña con bcrypt.compare()
  //      → Lanzar UnauthorizedException si no coincide
  //   3. Generar JWT con payload: { username, sub: user.id }
  //   4. Retornar { access_token: string }
  // ═══════════════════════════════════════════════════════
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    throw new Error('Method not implemented — Complete this functionality');
  }

  // ═══════════════════════════════════════════════════════
  // TODO (Opcional): Implementar getProfile y getUserById
  //   según los requerimientos de tu solución
  // ═══════════════════════════════════════════════════════
  getProfile(user: any) {
    return user;
  }

  async getUserById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({ id } as any);
    if (user) {
      const { password, ...result } = user as any;
      return result;
    }
    return null;
  }
}

