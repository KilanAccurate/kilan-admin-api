// src/fcm/fcm.module.ts
import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { FcmController } from './fcm.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationFirebase, NotificationSchema } from './model/notification.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: NotificationFirebase.name, schema: NotificationSchema },]),
    ],
    providers: [FcmService],
    controllers: [FcmController],
    exports: [FcmService],
})
export class FcmModule { }
