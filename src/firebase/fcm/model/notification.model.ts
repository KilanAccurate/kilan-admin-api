// src/fcm/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class NotificationFirebase {
    @Prop({ required: true })
    token: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    body: string;

    @Prop({ type: Object, default: {} })
    data: Record<string, string>;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationFirebase);
