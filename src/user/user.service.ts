import {
    HttpException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { BcryptService } from '../auth/bcrypt.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { iUser } from './entities/user.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly User: Model<iUser>,
        private readonly auth: AuthService,
        private readonly bcrypt: BcryptService
    ) {}
    async create(createUserDto: CreateUserDto) {
        try {
            createUserDto.avatar === ''
                ? (createUserDto.avatar =
                      'https://firebasestorage.googleapis.com/v0/b/chat-app-9ab62.appspot.com/o/files%2Fuser-default.png?alt=media&token=464d6d03-11e9-4f6b-a573-539b05d64ca4')
                : (createUserDto.avatar = createUserDto.avatar);
            const newUser = await this.User.create({
                ...createUserDto,
                password: this.bcrypt.encrypt(createUserDto.password),
            });
            return {
                user: newUser,
                status: 201,
            };
        } catch (ex) {
            throw new HttpException(
                'User was registered before, or data is incomplete or wrong formatted',
                400
            );
        }
    }

    async login(loginData: { email: string; password: string }) {
        const user = await this.User.findOne({
            email: loginData.email
        }).populate('rooms', {
            name: 0,
            users: 0,
            createdAt: 0,
            type: 0,
        });

        if (
            user === null ||
            !this.bcrypt.compare(loginData.password, user.password)
        )
            throw new UnauthorizedException('Password or email incorrect.');

        const token = this.auth.createToken(user.id);
        user.online = true;
        await user.save();
        // const temp = await this.User.findByIdAndUpdate(user._id, newUser)
        // const updatedUser = this.User.findById(user._id)
        // console.log(user);
        return {
            user,
            token,
        };
    }

    async loginWithToken(token: string) {
        try {
            const tokenData = this.auth.validateToken(
                token.substring(7)
            ) as JwtPayload;
            if (typeof tokenData === 'string')
                throw new UnauthorizedException();
            const user = await this.User.findById(tokenData.id);
            if (user === null)
                throw new NotFoundException('User does not exist.');
            const newToken = this.auth.createToken(user.id);
            return {
                user,
                token: newToken,
            };
        } catch (ex) {
            throw new UnauthorizedException('Session expired');
        }
    }

    async findAll() {
        const users = await this.User.find();
        return users;
    }

    async findOne(id: string) {
        const result = await this.User.findById(id).populate('rooms', {
            users: 0,
        });
        return result;
    }

    async update(id: string, token: string, updateUserDto: UpdateUserDto) {
        // console.log('user in service: ', id, token, updateUserDto);
        try {
            const user = await this.User.findById(id);
            // console.log('user encontrado in service: ', user);

            // if (user === null)
            //     throw new NotFoundException('User does not exist.');
            // const temp = await this.User.findByIdAndUpdate(user._id, {
            //     ...updateUserDto,
            //     password: this.bcrypt.encrypt(updateUserDto.password),
            // });
            if (user === null)
            throw new NotFoundException('User does not exist.');
        const temp = await this.User.findByIdAndUpdate(user._id, updateUserDto);
        // console.log('user actualizado in service: ', temp);

            const updatedUser = await this.User.findById(id);
            return updatedUser;
        } 
        // catch (ex) {
        //     throw new UnauthorizedException('Petición no autorizada!');
        // }
        catch(err){
            throw new Error(err);
        }
    }

    async updateOnConversation(id: string, token: string, roomId: string) {
        try {
            const user: iUser = await this.User.findById(id);
            user.onConversation = roomId;
            await this.User.findByIdAndUpdate(id, user);
            const updatedUser = await this.User.findById(id);

            return updatedUser;
        } catch (err) {
            // catch (ex) {
            //     throw new UnauthorizedException('Session expired');
            // }
            throw new Error(err);
        }
    }

    async remove(id: string, token: string) {
        const deletedUser = await this.User.findByIdAndDelete(id);

        if (deletedUser === null) {
            return { message: 'User not found for delete' };
        } else {
           
            return deletedUser;
        }
    }
}
