// src/fcm/fcm.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { FcmService } from './fcm.service';

@Controller('notifications')
export class FcmController {
    constructor(private readonly fcmService: FcmService) { }

    @Post('send')
    async sendNotification(
        @Body() body: {
            token: string;
            title: string;
            desc: string;
            data?: Record<string, string>;
        },
    ) {
        const { token, title, desc, data } = body;
        return this.fcmService.sendNotification(token, title, desc, data);
    }

}
