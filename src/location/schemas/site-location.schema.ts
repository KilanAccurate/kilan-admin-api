import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LatLng, LatLngSchema } from './lag-lng.schema';

export type SiteLocationDocument = HydratedDocument<SiteLocation>;

@Schema()
export class SiteLocation {
    @Prop({ required: true, unique: true })
    id: string;

    @Prop({ required: true })
    siteName: string;

    @Prop({ type: [LatLngSchema], required: true })
    sitePolygon: LatLng[];
}

export const SiteLocationSchema = SchemaFactory.createForClass(SiteLocation);
