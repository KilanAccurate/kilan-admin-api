import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { GlobalSettingService } from './global-setting.service';
import { formatResponse } from 'src/location/site-location.service';

@Controller('global-setting')
export class GlobalSettingController {
    constructor(private readonly globalSettingService: GlobalSettingService) { }

    @Get()
    async getSetting() {

        const setting = await this.globalSettingService.getAllSettings();
        if (!setting) {
            return formatResponse('error', 404, `Setting not found`);
        }

        return formatResponse('success', 200, 'Setting retrieved successfully', setting);
    }

    @Post()
    async updateSetting(@Body() body: { key: string; value: any }) {
        if (!body.key || body.value === undefined) {
            return formatResponse('error', 400, 'Invalid request body');
        }

        const updatedSetting = await this.globalSettingService.updateSetting(body.key, body.value);
        return formatResponse('success', 200, 'Setting updated successfully', updatedSetting);
    }
}
