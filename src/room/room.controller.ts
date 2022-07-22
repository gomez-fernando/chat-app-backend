import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';
import { CreateMessageDto } from '../message/dto/create.message.dto';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post()
    create(@Body() createRoomDto: CreateRoomDto) {
        return this.roomService.create({ ...createRoomDto });
    }

    @Post('group')
    createGroup(@Body() createRoomDto: CreateRoomDto) {
        return this.roomService.createGroup(createRoomDto);
    }

    @Post('message/:id')
    addMessage(
        @Param('id') id: string,
        @Body() createMessageDto: CreateMessageDto
    ) {
        return this.roomService.addMessage(id, createMessageDto);
    }

    @Get('user/:id')
    findAllByUser(@Param('id') id: string) {
        return this.roomService.findAllByUser(id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.roomService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
        return this.roomService.update(id, updateRoomDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.roomService.delete(id);
    }
}
