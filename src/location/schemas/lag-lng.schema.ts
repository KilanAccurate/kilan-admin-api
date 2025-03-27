import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class LatLng {
    @Prop({ required: true })
    lat: number;

    @Prop({ required: true })
    lng: number;
}

export const LatLngSchema = SchemaFactory.createForClass(LatLng);
