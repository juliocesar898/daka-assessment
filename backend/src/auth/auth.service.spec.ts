import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

describe('AuthService — Seed Tests (MikroORM)', () => {
  let service: AuthService;

  const mockUser: Partial<User> = {
    id: 1,
    username: 'existing_user',
    password: '$2b$10$hashedpasswordexample',
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    insert: jest.fn().mockResolvedValue(1),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_jwt_token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register()', () => {
    it('should throw ConflictException if username already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({
          username: 'existing_user',
          password: 'Test@1234',
          confirmPassword: 'Test@1234',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should NOT store the password in plain text', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await service.register({
        username: 'new_user',
        password: 'PlainPassword123',
        confirmPassword: 'PlainPassword123',
      });

      expect(mockUserRepository.insert).toHaveBeenCalled();
      const savedUser = mockUserRepository.insert.mock.calls[0][0];
      expect(savedUser.password).not.toBe('PlainPassword123');
      expect(await bcrypt.compare('PlainPassword123', savedUser.password)).toBe(true);
    });
  });

  describe('login()', () => {
    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({ username: 'ghost_user', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return access_token on valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPass123', 10);
      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        username: 'valid_user',
        password: hashedPassword,
      });

      const result = await service.login({
        username: 'valid_user',
        password: 'CorrectPass123',
      });

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mocked_jwt_token');
    });
  });
});