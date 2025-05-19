// ../fcm/fcm.controller.ts
import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { JwtAuthGuard } from '../../auth/jwt.guard';

@Controller('notifications')
export class FcmController {
    constructor(private readonly fcmService: FcmService) { }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getNotifications(
        @Request() req,
    ) {
        const accountId = req.user._id;
        return this.fcmService.getNotificationsForUser(accountId);
    }


    @UseGuards(JwtAuthGuard)
    @Post('send')
    async sendNotification(
        @Body() body: {
            to: string;
            title: string;
            desc: string;
            data?: Record<string, string>;
        },
        @Request() req,
    ) {
        console.log(req._id)
        const accountId = req.user._id;
        const { to, title, desc, data } = body;
        return this.fcmService.sendNotification(accountId, to, title, desc, data);
    }

}
