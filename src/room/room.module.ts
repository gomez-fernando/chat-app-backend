import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { AuthService } from '../auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { roomSchema } from './entities/room.model';
import { userSchema } from '../user/entities/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([

      {name: 'Room', schema: roomSchema},
      {name: 'User', schema: userSchema},
    ])
  ],
  providers: [RoomService, AuthService],
  controllers: [RoomController ]
})
export class RoomModule {}
