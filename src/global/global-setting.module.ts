import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalSettingService } from './global-setting.service';
import { GlobalSettingController } from './global-setting.controller';
import { GlobalSetting, GlobalSettingSchema } from './models/global-setting.model';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';
import { MediaSchema } from '../cloudinary/schemas/media.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: GlobalSetting.name, schema: GlobalSettingSchema }]),
        MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),
        CloudinaryModule,
    ],
    controllers: [GlobalSettingController],
    providers: [GlobalSettingService, CloudinaryProvider],
    exports: [GlobalSettingService],
})
export class GlobalSettingModule { }
