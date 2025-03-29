import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlobalSetting } from './models/global-setting.model';

@Injectable()
export class GlobalSettingService {
    constructor(
        @InjectModel(GlobalSetting.name) private globalSettingModel: Model<GlobalSetting>,
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
}
