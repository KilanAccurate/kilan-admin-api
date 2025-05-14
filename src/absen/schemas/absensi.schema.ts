import { model, Schema } from 'mongoose';
import { ApprovalData } from '../dto/absensi.dto';
import { SiteLocation, SiteLocationSchema } from 'src/location/schemas/site-location.schema';


const GeopifyLocationSchema = new Schema({
    name: { type: String },
    oldName: { type: String },
    country: { type: String },
    countryCode: { type: String },
    state: { type: String },
    county: { type: String },
    city: { type: String },
    postcode: { type: String },
    street: { type: String },
    housenumber: { type: String },
    lon: { type: Number },
    lat: { type: Number },
    stateCode: { type: String },
    distance: { type: Number },
    resultType: { type: String },
    formatted: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    category: { type: String },
    plusCode: { type: String },
    plusCodeShort: { type: String },
    placeId: { type: String },
}, { _id: false });
// Define Absensi schema
export const AbsensiSchema = new Schema({
    id: { type: String, required: true },
    accountId: { type: String, required: true },
    startDate: { type: Date },
    requestedDate: { type: Date },
    endDate: { type: Date },
    startImgUrl: { type: String },
    startImgId: { type: String },
    endImgUrl: { type: String },
    endImgId: { type: String },
    startLocation: { type: Object },
    endLocation: { type: Object },
    startPosition: { type: GeopifyLocationSchema },
    endPosition: { type: GeopifyLocationSchema },
    remarks: { type: String },
    isOverTime: { type: Boolean, default: false },
    pjoApproval: { type: Object },
    managerApproval: { type: Object },
    otType: { type: String },
    hrdApproval: { type: Object },
    detectedSite: { type: String }
}, {
    timestamps: true,
});

export interface Absensi {
    id: string;
    accountId: string;
    startDate?: Date;
    requestedDate?: Date;
    endDate?: Date;
    startImgUrl?: string;
    startImgId?: string;
    endImgUrl?: string;
    endImgId?: string;
    startLocation?: any;
    endLocation?: any;
    startPosition?: typeof GeopifyLocationSchema;
    endPosition?: typeof GeopifyLocationSchema;
    remarks?: string;
    isOverTime?: boolean;
    pjoApproval?: ApprovalData;
    managerApproval?: ApprovalData;
    otType?: string;
    hrdApproval?: ApprovalData;
    detectedSite?: string;
}

export type AbsensiDocument = Absensi & Document;
export const AbsensiModel = model<AbsensiDocument>('Absensi', AbsensiSchema);