// src/fcm/fcm.module.ts
import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { FcmController } from './fcm.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationFirebase, NotificationSchema } from './model/notification.model';
import { User, UserSchema } from 'src/auth/model/user.model';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: NotificationFirebase.name, schema: NotificationSchema },]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Ensure this is set correctly
            signOptions: { expiresIn: '1h' }, // Adjust expiry as needed
        }),
    ],
    providers: [FcmService, JwtStrategy],
    controllers: [FcmController],
    exports: [FcmService],
})
export class FcmModule { }
