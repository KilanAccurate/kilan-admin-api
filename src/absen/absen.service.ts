import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { formatResponse } from 'src/location/site-location.service';
import { v4 as uuidv4 } from 'uuid';
import { Absensi, AbsensiDocument } from './schemas/absensi.schema';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CreateAbsensiDto } from './dto/absensi.dto';
import { Media } from 'src/cloudinary/schemas/media.schema';

@Injectable()
export class AbsensiService {
    constructor(
        @InjectModel('Absensi') private absensiModel: Model<AbsensiDocument>,
        @InjectModel('Media') private mediaModel: Model<Media>,
        private cloudinaryService: CloudinaryService,
    ) { }

    async getUserAbsensiList(accountId: string): Promise<any> {
        try {
            const absensiList = await this.absensiModel.find({ accountId }).lean();
            return formatResponse('success', 200, 'Absensi list retrieved successfully', absensiList);
        } catch (error) {
            return formatResponse('error', 500, 'Failed to retrieve absensi list', error.message);
        }
    }

    async getUserAbsensi(accountId: string, absensiId: string): Promise<any> {
        try {
            const absensi = await this.absensiModel.findById(absensiId).exec();
            if (!absensi) {
                return formatResponse('error', 404, 'Absensi not found');
            }
            return formatResponse('success', 200, 'Absensi retrieved successfully', absensi);
        } catch (error) {
            return formatResponse('error', 500, 'Failed to retrieve absensi', error.message);
        }
    }

    async absenMasuk(
        accountId: string,
        absensiDto: CreateAbsensiDto,
        startImgFile?: Express.Multer.File
    ): Promise<any> {
        try {
            let startImgId: string | undefined;
            let startImgUrl: string | undefined;

            // If there is an image, upload it and store in Media collection
            if (startImgFile) {
                const uploadResult = await this.cloudinaryService.uploadImageMasuk(startImgFile).catch(() => null);
                if (!uploadResult) {
                    return formatResponse('error', 500, 'Image upload failed, absensi not added');
                }

                // Save Media document
                const newMedia = new this.mediaModel({
                    assetId: uploadResult.asset_id,
                    publicId: uploadResult.public_id,
                    version: uploadResult.version,
                    versionId: uploadResult.version_id,
                    signature: uploadResult.signature,
                    width: uploadResult.width,
                    height: uploadResult.height,
                    format: uploadResult.format,
                    resourceType: uploadResult.resource_type,
                    createdAt: uploadResult.created_at,
                    bytes: uploadResult.bytes,
                    type: uploadResult.type,
                    etag: uploadResult.etag,
                    placeholder: uploadResult.placeholder,
                    url: uploadResult.url,
                    secureUrl: uploadResult.secure_url,
                    assetFolder: uploadResult.asset_folder,
                    displayName: uploadResult.display_name,
                    originalFilename: uploadResult.original_filename,
                });

                const savedMedia = await newMedia.save();
                startImgId = savedMedia._id.toString();
                startImgUrl = savedMedia.url.toString();
            }

            if (typeof absensiDto.startPosition === "string") {
                absensiDto.startPosition = JSON.parse(absensiDto.startPosition);
            }

            // Create absensi only if the image (if provided) is uploaded successfully
            const newAbsensi = new this.absensiModel({
                id: uuidv4(),
                accountId,
                ...absensiDto,
                startImgId,
                startImgUrl,
            });

            const savedAbsensi = await newAbsensi.save();
            return formatResponse('success', 201, 'Absensi added successfully', savedAbsensi);
        } catch (error) {
            return formatResponse('error', 500, 'Failed to add absensi', error.message);
        }
    }
    async absenKeluar(
        absensiDto: CreateAbsensiDto,
        endImgFile?: Express.Multer.File,
        absensiId?: string,
    ): Promise<any> {
        try {
            let endImgId: string | undefined;
            let endImgUrl: string | undefined;

            const existedAbsen = await this.absensiModel.findById(absensiId);

            if (!existedAbsen) {
                return formatResponse('error', 404, 'Absensi not found');
            }

            // If there is an image, upload it and store in Media collection
            if (endImgFile) {
                const uploadResult = await this.cloudinaryService.uploadImageKeluar(endImgFile).catch(() => null);
                if (!uploadResult) {
                    return formatResponse('error', 500, 'Image upload failed, absensi not updated');
                }

                // Save Media document
                const newMedia = new this.mediaModel({
                    assetId: uploadResult.asset_id,
                    publicId: uploadResult.public_id,
                    version: uploadResult.version,
                    versionId: uploadResult.version_id,
                    signature: uploadResult.signature,
                    width: uploadResult.width,
                    height: uploadResult.height,
                    format: uploadResult.format,
                    resourceType: uploadResult.resource_type,
                    createdAt: uploadResult.created_at,
                    bytes: uploadResult.bytes,
                    type: uploadResult.type,
                    etag: uploadResult.etag,
                    placeholder: uploadResult.placeholder,
                    url: uploadResult.url,
                    secureUrl: uploadResult.secure_url,
                    assetFolder: uploadResult.asset_folder,
                    displayName: uploadResult.display_name,
                    originalFilename: uploadResult.original_filename,
                });

                const savedMedia = await newMedia.save();
                endImgId = savedMedia._id.toString();
                endImgUrl = savedMedia.url.toString();
            }

            if (typeof absensiDto.endPosition === "string") {
                absensiDto.endPosition = JSON.parse(absensiDto.endPosition);
            }

            // Update the existing absensi document
            existedAbsen.endPosition = absensiDto.endPosition as any;
            existedAbsen.endImgId = endImgId;
            existedAbsen.endImgUrl = endImgUrl;
            existedAbsen.endDate = absensiDto.endDate;
            existedAbsen.remarks = absensiDto.remarks;

            const updatedAbsensi = await existedAbsen.save();
            return formatResponse('success', 200, 'Absensi updated successfully', updatedAbsensi);
            // return formatResponse('success', 201, 'Absensi edited successfully');
        } catch (error) {
            return formatResponse('error', 500, 'Failed to add absensi', error.message);
        }
    }


}

