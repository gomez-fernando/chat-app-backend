import {
    HttpException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { iUser } from '../user/entities/user.model';
import { iRoom } from './entities/room.model';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateMessageDto } from '../message/dto/create.message.dto';
import { sortIds } from '../services/sortIds';

sortIds;
@Injectable()
export class RoomService {
    constructor(
        @InjectModel('Room') private readonly Room: Model<iRoom>,
        @InjectModel('User') private readonly User: Model<iUser>
    ) {}

    async create(createRoomDto: CreateRoomDto) {
        try {
            // createRoomDto.image === ''
            //     ? (createRoomDto.image =
            //           'https://firebasestorage.googleapis.com/v0/b/chat-app-9ab62.appspot.com/o/files%2Fgroup.png?alt=media&token=ce7f4407-df77-4675-9f10-8dc1f7d83869')
            //     : (createRoomDto.image = createRoomDto.image);
            

            const user1 = await this.User.findById(createRoomDto.users[0]);
            const user2 = await this.User.findById(createRoomDto.users[1]);

            const res = sortIds(createRoomDto.users as [string, string]);
            const name = res[0] + res[1];

            const newRoom = await this.Room.create({
                ...createRoomDto,
                name: name,
                type: 'p2p',
            });
            user1.rooms.push(newRoom.id);
            user1.onConversation = newRoom._id;
            await user1.save();
            user2.rooms.push(newRoom.id);
            await user2.save();
            return { newRoom: newRoom, users: [user1, user2] };
        } catch (ex) {
            throw new HttpException(
                'Room was created before, or data is incomplete or wrong formatted',
                400
            );
        }
    }

    // TODO set update date in the socket when updating user

    async createGroup(createRoomDto: CreateRoomDto) {
        try {
            createRoomDto.image === ''
                ? (createRoomDto.image =
                      'https://firebasestorage.googleapis.com/v0/b/chat-app-9ab62.appspot.com/o/files%2Fgroup.png?alt=media&token=ce7f4407-df77-4675-9f10-8dc1f7d83869')
                : (createRoomDto.image = createRoomDto.image);
            let newRoom: any;
            const users = createRoomDto.users.map(
                async (user) => await this.User.findById(user)
            );
            newRoom = Promise.all(users).then(async (users) => {
                newRoom = await this.Room.create({
                    ...createRoomDto,
                    type: 'group',
                });
                users.forEach(async (user) => {
                    user.rooms.push(newRoom.id);
                    await user.save();
                });
                return newRoom;
            });
            return newRoom;
        } catch (ex) {
            throw new HttpException(
                'Group was created before, or data is incomplete or wrong formatted',
                400
            );
        }
    }

    async findAllByUser(id: string) {
        const rooms = await this.Room.find({ users: id });
        return rooms;
    }

    async findOne(id: string) {
        const room = await this.Room.findById(id).populate('users', {
            rooms: 0,
            createdAt: 0,
            updatedAt: 0,
        });
        return room;
    }

    async update(id: string, updateRoomDto: UpdateRoomDto) {
        try {
            await this.Room.findByIdAndUpdate(id, updateRoomDto);
            const newRoom = await this.Room.findById(id);
            return newRoom;
        } catch (ex) {
            throw new HttpException(
                'Room does not exists, or incorrect data',
                401
            );
        }
    }

    async addMessage(id: string, createMessageDto: CreateMessageDto) {
        try {
            const room = await this.Room.findById(id);
            const newMessage = {
                ...createMessageDto,
                createdAt: JSON.stringify(new Date()),
            };
            room.messages.push(newMessage);
            await room.save();
            const newRoom = await this.Room.findById(id);
            return newRoom;
        } catch (ex) {
            throw new HttpException(
                'Room does not exists, or incorrect data',
                401
            );
        }
    }

    async updateSeenMessages(
        otheUserId: string,
        token: string,
        roomId: string
    ) {
        try {
            const room = await this.Room.findById(roomId);
            room.messages.forEach((message) => {
                if (message.sender === otheUserId) {
                    message.seen = true;
                }
            });
            await room.save();
            await this.Room.findByIdAndUpdate(roomId, room);

            const newRoom = await this.Room.findById(roomId);

            return newRoom;
        } catch (ex) {
            throw new HttpException(
                'Room does not exists, or incorrect data',
                401
            );
        }
    }

    async updateSeenMessagesGroup(
        roomId: string,
        userId: string,
        token: string
    ) {
        try {
            const room = await this.Room.findById(roomId);
            room.messages.forEach((message) => {
                if (message.seenBy.includes(userId)) {
                    message.seenBy.push(userId);
                }
            });
            await room.save();
            await this.Room.findByIdAndUpdate(roomId, room);

            const newRoom = await this.Room.findById(roomId);

            return newRoom;
        } catch (ex) {
            throw new HttpException(
                'Room does not exists, or incorrect data',
                401
            );
        }
    }

    async delete(id: string) {
        const deletedItem = await this.Room.findByIdAndDelete(id);
        if (deletedItem === null) {
            return { message: 'Room not found for delete' };
        } else {
            return deletedItem;
        }
    }
}
