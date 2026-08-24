import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

/**
 * Seed Tests — AuthService (MikroORM)
 * =====================================
 * Estos tests validan el núcleo de la autenticación.
 *
 * INSTRUCCIONES:
 *   - Implementa la lógica de AuthService hasta que TODOS pasen.
 *   - NO modifiques este archivo.
 *   - Ejecutar: npm run test -- auth.service.spec
 *
 * NOTA MikroORM: El patrón de acceso a datos en MikroORM usa EntityManager
 * o EntityRepository. El mock aquí simula un EntityRepository vía
 * getRepositoryToken(User) del módulo @mikro-orm/nestjs.
 */
describe('AuthService — Seed Tests (MikroORM)', () => {
  let service: AuthService;

  // Mock del EntityRepository de MikroORM
  const mockUserRepository = {
    findOne:   jest.fn(),
    create:    jest.fn(),
    persistAndFlush: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          // MikroORM provee el token con getRepositoryToken()
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // ===========================================================================
  // TEST 1 — El servicio existe
  // ===========================================================================

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ===========================================================================
  // TEST 2 — Register: no permite usernames duplicados
  // ===========================================================================

  it('register() should throw ConflictException if username already exists', async () => {
    // Simular que el usuario ya existe en la base de datos
    mockUserRepository.findOne.mockResolvedValue({ id: 1, username: 'existing_user' });

    await expect(
      service.register({ username: 'existing_user', password: 'Test@1234' }),
    ).rejects.toThrow(ConflictException);
  });

  // ===========================================================================
  // TEST 3 — Login: credenciales inválidas retornan UnauthorizedException
  // ===========================================================================

  it('login() should throw UnauthorizedException for invalid credentials', async () => {
    // Simular que el usuario no existe
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(
      service.login({ username: 'ghost_user', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  // ===========================================================================
  // TEST 4 — Register: la contraseña nunca se guarda en texto plano
  // ===========================================================================

  it('register() should NOT store the password in plain text', async () => {
    const plainPassword = 'Test@1234';

    mockUserRepository.findOne.mockResolvedValue(null);
    mockUserRepository.create.mockImplementation((dto) => ({ ...dto }));
    mockUserRepository.persistAndFlush.mockResolvedValue(undefined);

    await service.register({ username: 'new_user', password: plainPassword });

    // El argumento pasado a persistAndFlush es el usuario ya creado
    const savedUser = mockUserRepository.persistAndFlush.mock.calls[0][0];

    // La contraseña guardada NO debe ser igual a la contraseña original
    expect(savedUser.password).not.toBe(plainPassword);
    // Longitud mayor indica bcrypt hash ($2b$...)
    expect(savedUser.password.length).toBeGreaterThan(plainPassword.length);
  });

  // ===========================================================================
  // TEST 5 — Login exitoso retorna access_token
  // ===========================================================================

  it('login() should return access_token on valid credentials', async () => {
    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash('Test@1234', 10);

    mockUserRepository.findOne.mockResolvedValue({
      id: 1,
      username: 'valid_user',
      password: hashed,
    });

    const result = await service.login({ username: 'valid_user', password: 'Test@1234' });

    expect(result).toHaveProperty('access_token');
    expect(typeof result.access_token).toBe('string');
  });
});

