import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { RoomService } from "./room/room.service";
import { CreateRoomDto } from "./room/dto/create-room.dto";
import { UpdateUserDto } from "./user/dto/update-user.dto";
import { UserService } from "./user/user.service";
import { CreateMessageDto } from "./message/dto/create.message.dto";

// @WebSocketGateway(80, {namespace: 'chat'})
@WebSocketGateway({ cors: '*:*' })
export class ChatGateaway {
    constructor(
        private readonly roomService: RoomService,
        private readonly userService: UserService,
    ){}

    @WebSocketServer()
    server;

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() message: { roomId: string, message: CreateMessageDto}): Promise<void> {
        // TODO review if its works fine in changing the iMessage by createMessageDto
        const newRoom = await   this.roomService.addMessage(message.roomId, message.message);
        this.server.emit('message', newRoom);
    }

    @SubscribeMessage('new-p2p-room')
    async newP2pRoom(@MessageBody() room: CreateRoomDto): Promise<void> {
        const newRoom = await   this.roomService.create(room);
        this.server.emit('new-p2p-room', newRoom);
    }

    @SubscribeMessage('new-group-room')
    async newGroupRoom(@MessageBody() room: CreateRoomDto): Promise<void> {
        const newRoom = await   this.roomService.createGroup(room);
        this.server.emit('new-group-room', newRoom);

    }

    @SubscribeMessage('update-user')
    async updateUser(@MessageBody() newUser: UpdateUserDto): Promise<void> {
        const updatedUser = await   this.userService.update(newUser._id, newUser.token, newUser);
        this.server.emit('update-user', updatedUser);
    }

    @SubscribeMessage('update-seen-messages')
    async updateSeenMessages(@MessageBody() data: {otherUserId: string, token: string, roomId: string}): Promise<void> {
        const updatedRoom = await this.roomService.updateSeenMessages(data.otherUserId, data.token, data.roomId);
        this.server.emit('update-seen-messages', updatedRoom);
    }

    @SubscribeMessage('update-seen-messages-group')
    async updateSeenMessagesGroup(@MessageBody() data: {roomId: string, token: string, userId: string}): Promise<void> {
        const updatedRoom = await this.roomService.updateSeenMessagesGroup(data.roomId, data.token, data.userId);
        this.server.emit('update-seen-messages', updatedRoom);
    }

    @SubscribeMessage('on-conversation')
    async onconversation(@MessageBody() data: {userId: string, token: string, roomId: string}): Promise<void> {
        const updatedUser = await this.userService.updateOnConversation(data.userId, data.token, data.roomId);
        this.server.emit('on-conversation', updatedUser);
    }

    @SubscribeMessage('delete-account')
    async deleteAccount(@MessageBody() data: {id: string, token: string}): Promise<void> {
        console.log('id received:', data.id);
        const deletedUser = await this.userService.remove(data.id, data.token);
        console.log('deleted user in gateaway: ', deletedUser);
        this.server.emit('delete-account', deletedUser);
    }

}