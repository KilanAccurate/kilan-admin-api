import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SiteLocation } from '../../location/model/site-location.model';

export type UserDocument = User & Document;

export enum Role {
    PJO = 'pjo',
    Manager = 'manager',
    Staff = 'staff',
    Admin = 'admin',
    HRD = 'hrd',
}

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    fullName: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false })
    position: string;

    @Prop({ required: false })
    department: string;

    @Prop({ required: true, unique: true })
    nik: string;

    @Prop({ required: true, type: SiteLocation })
    site: SiteLocation;

    @Prop({ required: false })
    phone: string;

    @Prop({ required: false })
    salary: number;

    @Prop({ required: false })
    fcmToken?: string;

    @Prop({ required: false })
    fcmTokenExpiresAt?: Date;

    @Prop({ required: true, enum: Role })
    role: Role;


    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    static async verifyPassword(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}


export const UserSchema = SchemaFactory.createForClass(User);
