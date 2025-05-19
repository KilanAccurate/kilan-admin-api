// ../fcm/fcm.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDocument, NotificationFirebase } from './model/notification.model';
import { User, UserDocument } from '../../auth/model/user.model';
import { formatResponse } from '../../helper/response.helper';

@Injectable()
export class FcmService {
    constructor(
        @InjectModel(NotificationFirebase.name) private notificationModel: Model<NotificationDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
        if (!admin.apps.length) {
            const serviceAccountBase64 = process.env.FIREBASE_ADMINSDK_BASE64;
            if (!serviceAccountBase64) {
                throw new Error('Missing FIREBASE_ADMINSDK_BASE64 environment variable');
            }

            const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
            const serviceAccount = JSON.parse(serviceAccountJson);

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
    }

    async getNotificationsForUser(userId: string) {
        try {
            const notifications = await this.notificationModel
                .find({ to: userId })
                .sort({ createdAt: -1 }) // recent first
                .populate('from', 'fullName') // optional: populate sender info
                .exec();

            return {
                status: 'success',
                statusCode: 200,
                data: notifications,
            };
        } catch (error) {
            console.error('Fetch notification error:', error);
            return {
                status: 'error',
                statusCode: 500,
                message: 'Internal server error',
            };
        }
    }

    async sendNotification(
        from: string,
        to: string,
        title: string,
        body: string,
        data: Record<string, string> = {},
    ) {
        console.log('hello')
        const ownUser = await this.userModel.findById(from);
        if (!ownUser) {
            return formatResponse('error', 404, 'own user not found');
        }
        const user = await this.userModel.findById(to);
        if (!user) {
            return formatResponse('error', 404, 'target user not found');
        }

        // Save to DB regardless
        await this.notificationModel.create({ from, to, title, body, data });

        // Check for token existence and expiry
        const now = new Date();
        const tokenValid = user.fcmToken && (!user.fcmTokenExpiresAt || user.fcmTokenExpiresAt > now);
        // return { success: true };
        if (tokenValid) {
            const message: admin.messaging.Message = {
                notification: { title, body },
                data,
                token: user.fcmToken!,
            };

            try {
                const response = await admin.messaging().send(message);
                return { success: true, response };
            } catch (error) {
                return { success: false, error };
            }
        }

        return { success: false, reason: 'Token is null or expired' };
    }

}
