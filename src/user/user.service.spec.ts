import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { BcryptService } from '../auth/bcrypt.service';
import { userSchema } from './entities/user.model';
import { UserService } from './user.service';

describe('UserService', () => {
    const mockUser = {
        email: 'user1@test.com',
        password: '123456',
        name: 'nombre',
        surname: 'apellido',
        nickname: 'nick1',
        online: false
    };

    const mockUpdatedUser = { ...mockUser, name: 'updated name' };

    const mockUserModel = {
        create: jest.fn().mockResolvedValue(mockUser),
        find: jest.fn().mockResolvedValue([mockUser]),
        findOne: jest.fn().mockResolvedValue(mockUser),
        findById: jest.fn().mockResolvedValue(mockUser),
        findByIdAndUpdate: jest.fn().mockResolvedValue(mockUpdatedUser),
        findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
    };

    const mockBcrypt = {
        encrypt: jest.fn().mockReturnValue('hashpw'),
        compare: jest.fn().mockReturnValue(true),
    };

    const mockAuth = {
        validateToken: jest.fn().mockReturnValue({ id: 'id' }),
        createToken: jest.fn().mockReturnValue('token'),
    };

    const mockResponse = {
        status: 201,
        user: mockUser,
    };

    const mockLoginResponse = {
        token: 'token',
        user: mockUser,
    };

    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forFeature([
                    { name: 'User', schema: userSchema },
                ]),
            ],
            providers: [
                UserService,
                {
                    provide: AuthService,
                    useValue: mockAuth,
                },
                {
                    provide: BcryptService,
                    useValue: mockBcrypt,
                },
            ],
        })
            .overrideProvider(getModelToken('User'))
            .useValue(mockUserModel)
            .compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('When calling service.create', () => {
        test('Then it should return the saved user', async () => {
            const result = await service.create(mockUser);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('When calling service.create and throws error ', () => {
        test('Then it should return an error', async () => {
            mockUserModel.create.mockRejectedValueOnce('string');
            expect(async () => {
                await service.create(mockUser);
            }).rejects.toThrow();
        });
    });

    describe('When calling service.login with valid login info', () => {
        test('Then it should return the user data and token', async () => {
            mockUserModel.findOne.mockReturnValueOnce({
                populate: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await service.login(mockUser);
            expect(result).toEqual(mockLoginResponse);
        });
    });

    describe('When calling service.login with invalid email', () => {
        test('Then it should throw an unauthorized exception', async () => {
            mockUserModel.findOne.mockReturnValueOnce({
                populate: jest.fn().mockResolvedValue(null),
            });
            expect(async () => {
                await service.login({
                    email: mockUser.email,
                    password: mockUser.password,
                });
            }).rejects.toThrow();
        });
    });

    describe('When calling service.login with invalid password', () => {
        test('Then it should throw an unauthorized exception', async () => {
            mockBcrypt.compare.mockReturnValueOnce(false);
            expect(async () => {
                await service.login({
                    email: mockUser.email,
                    password: mockUser.password,
                });
            }).rejects.toThrow();
        });
    });

    describe('When calling service.loginWithToken with a valid token', () => {
        test('Then it should return the user data and token', async () => {
            mockUserModel.findById.mockResolvedValue(mockUser);
            const result = await service.loginWithToken('token');
            expect(result).toEqual(mockLoginResponse);
        });
    });

    describe('When calling service.loginWithToken with a valid token but user does not exist', () => {
        test('Then it should throw an unauthorized exception', async () => {
            mockUserModel.findById.mockResolvedValueOnce(null);
            expect(async () => {
                await service.loginWithToken('token');
            }).rejects.toThrow();
        });
    });

    describe('When calling service.login and throws error ', () => {
        test('Then it should return an error', async () => {
            mockUserModel.create.mockRejectedValueOnce('string');
            expect(async () => {
                await service.login(mockUser);
            }).rejects.toThrow();
        });
    });

    describe('When calling service.findAll ', () => {
        test('Then it should return an array of users', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockUser]);
        });
    });

    describe('When calling service.findOne ', () => {
        test('Then it should return an item', async () => {
            mockUserModel.findById.mockReturnValueOnce({
                ...mockUser,
                populate: jest.fn().mockResolvedValue(mockUser),
            });
            const result = await service.findOne('id');
            expect(result).toEqual(mockUser);
        });
    });

    describe('When calling service.update ', () => {
        mockUserModel.findById.mockResolvedValue(mockUpdatedUser);
        test('Then it should return the new object', async () => {
            mockUserModel.findById.mockResolvedValue(mockUpdatedUser);
            const result = await service.update('id', 'token', mockUpdatedUser);
            expect(result).toEqual(mockUpdatedUser);
        });
    });

    describe('When calling service.update and throws error ', () => {
        test('Then it should return an error', async () => {
            mockUserModel.findByIdAndUpdate.mockRejectedValueOnce('string');
            expect(async () => {
                await service.update('id', 'token', mockUser);
            }).rejects.toThrow();
        });
    });

    describe('When calling service.remove ', () => {
        test('Then it should return the deleted object', async () => {
            const result = await service.remove('id', 'token');
            expect(result).toEqual(mockUser);
        });
    });

    describe('When calling service.remove with a wrong id', () => {
        test('Then it should return the deleted object', async () => {
            mockUserModel.findByIdAndDelete.mockResolvedValueOnce(null);
            const result = await service.remove('id', 'token');
            expect(result).toEqual({ message: 'User not found for delete' });
        });
    });
});
