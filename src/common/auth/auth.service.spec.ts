import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let users: User[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    })
      .overrideProvider(UsersService)
      .useValue({
        findOneByName: jest
          .fn()
          .mockImplementation((name) => users.find((u) => u.name === name)),
      })
      .overrideProvider(JwtService)
      .useValue({})
      .compile();

    service = module.get<AuthService>(AuthService);
    users = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate user', () => {
    it('should return null if password mismatch', async () => {
      users.push(
        new User({
          name: 'Test',
          password: '12345678',
          active: true,
        }),
      );
      expect(await service.validateUser('Test', 'wrong')).toEqual(null);
    });
    it('should return null if user not active', async () => {
      users.push(
        new User({
          name: 'Test',
          password: '12345678',
          active: false,
        }),
      );
      expect(await service.validateUser('Test', '12345678')).toEqual(null);
    });
    it('should return user without password if ok', async () => {
      const salt = await bcrypt.genSalt();
      users.push(
        new User({
          name: 'Test',
          password: await bcrypt.hash('12345678', salt),
          active: true,
        }),
      );
      expect(await service.validateUser('Test', '12345678')).toEqual({
        name: 'Test',
        active: true,
      });
    });
  });
});
