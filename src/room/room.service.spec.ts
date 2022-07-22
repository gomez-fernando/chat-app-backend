import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { userSchema } from '../user/entities/user.model';
import { roomSchema } from './entities/room.model';
import { RoomService } from './room.service';

describe('RoomService', () => {
    let service: RoomService;

    const mockUser = {
        email: 'user1@test.com',
        password: '123456',
        name: 'nombre',
        surname: 'apellido',
        rooms: [],
        save: jest.fn(),
    };

    const mockRoom = {
        id: '12',
        name: 'weroi2o34u2',
        users: ['234kj', '234j234'],
        type: 'p2p',
        owner: 'owner',
        image: 'https...',
    };

    const mockUpdatedUser = { ...mockUser, name: 'updated' };
    const mockUpdatedRoom = { ...mockRoom, name: 'updated' };

    const mockUserModel = {
        create: jest.fn().mockResolvedValue(mockUser),
        find: jest.fn().mockResolvedValue([mockUser]),
        findOne: jest.fn().mockResolvedValue(mockUser),
        findById: jest.fn().mockResolvedValue(mockUser),
        findByIdAndUpdate: jest.fn().mockResolvedValue(mockUpdatedUser),
        findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
    };

    const mockRoomModel = {
        create: jest.fn().mockResolvedValue(mockRoom),
        createGroup: jest.fn().mockResolvedValue(mockRoom),
        find: jest.fn().mockResolvedValue([mockRoom]),
        findOne: jest.fn().mockResolvedValue(mockRoom),
        findById: jest.fn().mockResolvedValue(mockRoom),
        findByIdAndUpdate: jest.fn().mockResolvedValue(mockUpdatedRoom),
        findByIdAndDelete: jest.fn().mockResolvedValue(mockRoom),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forFeature([
                    { name: 'Room', schema: roomSchema },
                    { name: 'User', schema: userSchema },
                ]),
            ],
            providers: [
                RoomService,
                {
                    provide: UserService,
                    useValue: mockUserModel,
                },
            ],
        })
            .overrideProvider(getModelToken('Room'))
            .useValue(mockRoomModel)
            .overrideProvider(getModelToken('User'))
            .useValue(mockUserModel)
            .compile();

        service = module.get<RoomService>(RoomService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('When calling service.create ', () => {
        test('Then it should return the new object', async () => {
            const result = await service.create(mockRoom);
            expect(result).toEqual(mockRoom);
        });
    });

    describe('When calling service.create and an issue occurs', () => {
        test('Then it should return an exception', async () => {
            mockRoomModel.create.mockRejectedValueOnce({});
            expect(async () => {
                await service.create(mockRoom);
            }).rejects.toThrow();
        });
    });

    describe('When calling service.createGroup ', () => {
        test('Then it should return the new object', async () => {
            const result = await service.createGroup(mockRoom);
            expect(result).toEqual(mockRoom);
        });
    });

    describe('When calling service.createGroup and an issue occurs', () => {
        test('Then it should return an exception', async () => {
            mockRoomModel.createGroup.mockRejectedValueOnce({});
            expect(async () => {
                await service.createGroup(undefined);
            }).rejects.toThrow();
        });
    });

    describe('When calling service.findAllByUser ', () => {
        test('Then it should return an array of rooms', async () => {
            const result = await service.findAllByUser('id');
            expect(result).toEqual([mockRoom]);
        });
    });

    describe('When calling service.findOne ', () => {
        test('Then it should return an room', async () => {
            mockRoomModel.findById.mockReturnValueOnce({
                ...mockRoom,
                populate: jest.fn().mockResolvedValue(mockRoom),
            });
            const result = await service.findOne('id');
            expect(result).toEqual(mockRoom);
        });
    });

    describe('When calling service.update ', () => {
        test('Then it should return the updated room', async () => {
            mockRoomModel.findById.mockResolvedValue(mockUpdatedRoom);
            const result = await service.update('id', mockUpdatedRoom);
            expect(result).toEqual(mockUpdatedRoom);
        });
    });

    describe('When calling service.update and an issue occurs', () => {
        test('Then it should return an exception', async () => {
            mockRoomModel.findByIdAndUpdate.mockRejectedValueOnce(null);
            expect(async () => {
                await service.update('id', mockUpdatedRoom);
            }).rejects.toThrow();
        });
    });

    describe('When calling service.delete ', () => {
        test('Then it should return the deleted object', async () => {
            const result = await service.delete('id');
            expect(result).toEqual(mockRoom);
        });
    });

    describe('When calling service.delete with a wrong id ', () => {
        test('Then it should return the deleted object', async () => {
            mockRoomModel.findByIdAndDelete.mockResolvedValueOnce(null);
            const result = await service.delete('id');
            expect(result).toEqual({ message: 'Room not found for delete' });
        });
    });
});
