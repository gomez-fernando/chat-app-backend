import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('AppController (e2e)', () => {
    const auth = new AuthService(); 
    let app: INestApplication;
    let userToken: string;
    let userToken2: string;
    let userToken3: string;
    let userId: string;
    let userId2: string;
    let userId3: string;
    let roomId: string;
    let roomGroupId: string;

    const mockUser: CreateUserDto = {
        "email": "user1@test.com",
        "password": "123456",
        "name": "Fernando",
        "surname": "Gómez",
        "nickname": "nick1"
    };

    const mockUser2 = {...mockUser, email: 'user2@test.com', nickname: 'nick2'}
    const mockUser3 = {...mockUser, email: 'user3@test.com', nickname: 'nick3'}

    let mockRoom = {
        users: ['62c3236fd8eb35af4a87466c', '62c3236fd8eb35af4a87466e'],
        type: 'p2p'
    }

    const mockMessage = {
        sender: 'string',
        recipients: ['user1', 'user2'],
        content: 'content of message',
      }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('/user (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/user')
            .send(mockUser)
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        userId = response.body.user._id;
    });

    test('/user (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/user')
            .send(mockUser2)
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        userId2 = response.body.user._id;
    });

    test('/user (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/user')
            .send(mockUser3)
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        userId3 = response.body.user._id;
    });

    test('/user/login (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/user/login')
            .send({
                "email": "user1@test.com",
                "password": "123456"
              })
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        userToken = (
            auth.createToken(
                userId
            ) 
        );
    });

    test('/user/login (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/user/login')
            .send({
                "email": "user2@test.com",
                "password": "123456"
              })
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        userToken2 = (
            auth.createToken(
                userId
            ) 
        );
    });

    test('/user/login (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/user/login')
            .send({
                "email": "user3@test.com",
                "password": "123456"
              })
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        userToken3 = (
            auth.createToken(
                userId
            ) 
        );
    });

    test('/user (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/user`)
            .set('Authorization', `bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

    test('/user/:id (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/user/${userId}`)
            .set('Authorization', `bearer ${userToken}`);
        expect(response.status).toBe(200);
    });


    test('/room (POST)', async () => {
        mockRoom = {...mockRoom, users: [`${userId}`, `${userId2}`]}
        const response = await request(app.getHttpServer())
            .post('/room')
            .send(mockRoom)
            .set('Authorization', `bearer ${userToken}`);

            roomId = response.body._id;
        expect(response.status).toBe(201);
    });

    test('/room/group (POST)', async () => {
        mockRoom = {...mockRoom, users: [`${userId}`, `${userId3}`]}
        const response = await request(app.getHttpServer())
            .post('/room/group')
            .send(mockRoom)
            .set('Authorization', `bearer ${userToken}`);
            roomGroupId = response.body._id;
        expect(response.status).toBe(201);
    });

    test('/room/user/:id (GET) By User Id', async () => {
        const response = await request(app.getHttpServer())
            .get(`/room/user/${userId}`)
            .set('Authorization', `bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

    test('/room/:id (GET) By Room Id', async () => {
        const response = await request(app.getHttpServer())
            .get(`/room/${roomId}`)
            .set('Authorization', `bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

    test('/user/:id (PATCH)', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/user/${userId}`)
            .send({ name: 'updated name' })
            .set('Authorization', `bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('updated name');
    });

    test('/room/:id (PATCH)', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/room/${roomId}`)
            .send({ name: 'updated name' })
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('updated name');
    });

    // test('/message/:id (POST)', async () => {
    //     const response = await request(app.getHttpServer())
    //         .post(`/message/${roomId}`)
    //         .send(mockMessage)
    //         .set('Accept', 'application/json')
    //         .set('Authorization', `bearer ${userToken}`);

    //     expect(response.status).toBe(200);
    //     expect(response.body.type).toBe('p2p');
    // });

    test('/:id (DELETE)', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/room/${roomId}`)
            .set('Authorization', `bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

    test('/:id (DELETE)', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/room/${roomGroupId}`)
            .set('Authorization', `bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

    test('/user/:id (DELETE)', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/user/${userId}`)
            .set('Authorization', `bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

    test('/user/:id (DELETE)', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/user/${userId2}`)
            .set('Authorization', `bearer ${userToken2}`);
        expect(response.status).toBe(200);
    });

    test('/user/:id (DELETE)', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/user/${userId3}`)
            .set('Authorization', `bearer ${userToken3}`);
        expect(response.status).toBe(200);
    });

});  