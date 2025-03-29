import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalSettingService } from './global-setting.service';
import { GlobalSettingController } from './global-setting.controller';
import { GlobalSetting, GlobalSettingSchema } from './models/global-setting.model';

@Module({
    imports: [MongooseModule.forFeature([{ name: GlobalSetting.name, schema: GlobalSettingSchema }])],
    controllers: [GlobalSettingController],
    providers: [GlobalSettingService],
    exports: [GlobalSettingService],
})
export class GlobalSettingModule { }
