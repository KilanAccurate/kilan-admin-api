import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    fullName: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    position: string;

    @Prop({ required: true })
    department: {
        uid: string;
    };

    @Prop({ required: true, unique: true })
    nik: string;

    @Prop({ required: true })
    site: any; // Replace with your final site object type

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    salary: number;

    @Prop({ required: true, enum: ['superior', 'staff', 'admin'] })
    role: string;

    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    static async verifyPassword(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}


export const UserSchema = SchemaFactory.createForClass(User);
