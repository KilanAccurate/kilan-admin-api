// src/fcm/fcm.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FcmService {
    constructor() {
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
        data?: { [key: string]: string },
    ) {
        const message: admin.messaging.Message = {
            notification: {
                title,
                body,
            },
            data: data || {},
            token,
        };

        try {
            const response = await admin.messaging().send(message);
            return { success: true, response };
        } catch (error) {
            return { success: false, error };
        }
    }

}
