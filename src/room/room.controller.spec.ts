import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { BcryptService } from '../auth/bcrypt.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

describe('RoomController', () => {
  let controller: RoomController;
  let service: RoomService;

  const mockRoom: CreateRoomDto = {
    name: 'sala',
    users: ['2323', '2323'],
    owner: 'id',
    image: ''
  }

  const mockMessage = {
    sender: 'string',
    recipients: ['user1', 'user2'],
    content: 'content of message',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        {
          provide: RoomService,
          useValue: {
            create: jest.fn(),
            createGroup: jest.fn(),
            addMessage: jest.fn(),
            findAllByUser: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        AuthService,
        BcryptService,
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    service = module.get<RoomService>(RoomService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When calling controller.create', () => {
    test('Then service.create should be called', () => {
      controller.create(mockRoom);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('When calling controller.createGroup', () => {
    test('Then service.createGroup should be called', () => {
      controller.createGroup(mockRoom);
      expect(service.createGroup).toHaveBeenCalled();
    });
  });

  describe('When calling controller.addMessage', () => {
    test('Then service.addMessage should be called', () => {
      controller.addMessage('room id', mockMessage);
      expect(service.addMessage).toHaveBeenCalled();
    });
  });

    describe('When calling controller.findAllByUser', () => {
        test('Then service.findAllByUser should be called', () => {
        controller.findAllByUser(
            'id'
        );
        expect(service.findAllByUser).toHaveBeenCalled();
        });
    });

    describe('When calling controller.findOne', () => {
        test('Then service.findOne should be called', () => {
        controller.findOne(
            'id'
        );
        expect(service.findOne).toHaveBeenCalled();
        });
    });

    describe('When calling controller.update', () => {
        test('Then service.update should be called', () => {
        controller.update('12', mockRoom);
        expect(service.update).toHaveBeenCalled();
        });
    });

    describe('When calling controller.delete', () => {
        test('Then service.delete should be called', () => {
        controller.delete('id');
        expect(service.delete).toHaveBeenCalled();
        });
    });
});
