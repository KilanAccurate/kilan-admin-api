import { Schema, Document, model } from "mongoose";

export const MediaSchema = new Schema({
    assetId: { type: String, required: true },
    publicId: { type: String, required: true },
    version: { type: Number, required: true },
    versionId: { type: String, required: true },
    signature: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    format: { type: String, required: true },
    resourceType: { type: String, required: true },
    createdAt: { type: Date, required: true },
    bytes: { type: Number, required: true },
    type: { type: String, required: true },
    etag: { type: String, required: true },
    placeholder: { type: Boolean, required: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    assetFolder: { type: String, required: true },
    displayName: { type: String, required: true },
    originalFilename: { type: String, required: true },
}, { timestamps: true });

export interface Media extends Document {
    assetId: string;
    publicId: string;
    version: number;
    versionId: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resourceType: string;
    createdAt: Date;
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secureUrl: string;
    assetFolder: string;
    displayName: string;
    originalFilename: string;
}

export const MediaModel = model<Media>("Media", MediaSchema);
