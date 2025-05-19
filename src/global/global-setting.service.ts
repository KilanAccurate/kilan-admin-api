import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlobalSetting } from './models/global-setting.model';
import { Media } from '../cloudinary/schemas/media.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class GlobalSettingService {
    constructor(
        @InjectModel(GlobalSetting.name) private globalSettingModel: Model<GlobalSetting>,
        @InjectModel('Media') private mediaModel: Model<Media>,
        private cloudinaryService: CloudinaryService,
    ) { }

    async getAllSettings(): Promise<Record<string, any>> {
        const settings = await this.globalSettingModel.find().exec();
        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, any>);
    }

    async updateSetting(key: string, value: any): Promise<GlobalSetting> {
        return this.globalSettingModel.findOneAndUpdate(
            { key },
            { value },
            { new: true, upsert: true },
        );
    }

    async getSettingByKey(key: string): Promise<GlobalSetting | null> {
        return this.globalSettingModel.findOne({ key }).exec();
    }

    async uploadCarouselImage(file: Express.Multer.File): Promise<string[]> {
        const uploadResult = await this.cloudinaryService.uploadImageGeneral(file).catch(() => null);

        if (!uploadResult) {
            throw new NotFoundException('Image upload failed');
        }

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

        await newMedia.save();

        const key = 'Carousel-List';
        const setting = await this.globalSettingModel.findOne({ key });

        let updatedUrls: string[];

        if (setting) {
            const currentList = Array.isArray(setting.value) ? setting.value : [];
            updatedUrls = [...currentList, uploadResult.secure_url];
            setting.value = updatedUrls;
            await setting.save();
        } else {
            updatedUrls = [uploadResult.secure_url];
            await this.globalSettingModel.create({ key, value: updatedUrls });
        }

        return updatedUrls;
    }
}
