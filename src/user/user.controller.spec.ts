import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { BcryptService } from '../auth/bcrypt.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = {
    email: 'user1@test.com',
    password: 'test',
    name: 'nombre',
    surname: 'apellido',
    nickname: 'nick1'
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            login: jest.fn(),
            loginWithToken: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        AuthService,
        BcryptService,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When calling controller.create', () => {
    test('Then service.create should be called', () => {
      controller.create(mockUser);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('When calling controller.login without token', () => {
    test('Then service.login should be called', () => {
      controller.login(
        {
          email: '',
          password: '',
        },
        undefined
      );
      expect(service.login).toHaveBeenCalled();
    });
  });

  describe('When calling controller.login with token', () => {
    test('Then service.loginWithToken should be called', () => {
      controller.login(
        {
          email: '',
          password: '',
        },
        'token'
      );
      expect(service.loginWithToken).toHaveBeenCalled();
    });
  });

  describe('When calling controller.findAll with token', () => {
    test('Then service.findAll should be called', () => {
      controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('When calling controller.findOne with token', () => {
    test('Then service.findOne should be called', () => {
      controller.findOne('id');
      expect(service.findOne).toHaveBeenCalled();
    });
  });

  describe('When calling controller.update with token', () => {
    test('Then service.update should be called', () => {
      controller.update('id', mockUser, 'token');
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('When calling controller.remove with token', () => {
    test('Then service.remove should be called', () => {
      controller.remove('id', 'token');
      expect(service.remove).toHaveBeenCalled();
    });
  });
});
