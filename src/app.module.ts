import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { BcryptService } from './auth/bcrypt.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ChatGateaway } from './chat.gateaway';
import { RoomService } from './room/room.service';
import { roomSchema } from './room/entities/room.model';
import { userSchema } from './user/entities/user.model';
import { UserService } from './user/user.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(
            `mongodb+srv://${process.env.MONGO_USER}:${
                process.env.PASSWORD
            }@cluster0.pi2mx6i.mongodb.net/${
                process.env.NODE_ENV === 'test'
                    ? process.env.TEST_DBNAME
                    : process.env.DBNAME
            }?retryWrites=true&w=majority`
        ),
        MongooseModule.forFeature([
            { name: 'Room', schema: roomSchema },
            { name: 'User', schema: userSchema },
        ]),
        RoomModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        AuthService,
        RoomService,
        UserService,
        BcryptService,
        ChatGateaway,
    ],
})
// export class AppModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .exclude(
//         { path: 'user', method: RequestMethod.POST },
//         { path: 'user/login', method: RequestMethod.POST },
//       )
//       .forRoutes('*');
//   }
// }
export class AppModule {}
