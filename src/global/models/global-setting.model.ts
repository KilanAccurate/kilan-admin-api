import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';


@Schema()
export class GlobalSetting extends Document {
    @Prop({ required: true, unique: true })
    key: string;

    @Prop({ type: SchemaTypes.Mixed, required: true }) // Allow any type
    value: any;
}

export const GlobalSettingSchema = SchemaFactory.createForClass(GlobalSetting);
