// src/fcm/fcm.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDocument, NotificationFirebase } from './model/notification.model';

@Injectable()
export class FcmService {
    constructor(
        @InjectModel(NotificationFirebase.name)
        private notificationModel: Model<NotificationDocument>,
    ) {
        const serviceAccountPath = path.resolve(
            __dirname,
            '../../../firebase-adminsdk.json',
        );

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccountPath),
            });
        }
    }

    async sendNotification(
        token: string,
        title: string,
        body: string,
        data: Record<string, string> = {},
    ) {
        const message: admin.messaging.Message = {
            notification: {
                title,
                body,
            },
            data,
            token,
        };

        await this.notificationModel.create({ token, title, body, data });

        try {
            const response = await admin.messaging().send(message);
            return { success: true, response };
        } catch (error) {
            return { success: false, error };
        }
    }
}
