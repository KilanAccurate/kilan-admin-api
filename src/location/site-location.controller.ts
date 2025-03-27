import { Controller, Get, Post, Body, Headers, ForbiddenException, Param } from '@nestjs/common';
import { SiteLocationService } from '../location/site-location.service';
import { SiteLocation } from '../location/schemas/site-location.schema';
import { ConfigService } from '@nestjs/config';

@Controller('site-locations')
export class SiteLocationController {
    constructor(
        private readonly siteLocationService: SiteLocationService,
        private readonly configService: ConfigService
    ) { }

    @Get()
    async getAll(): Promise<SiteLocation[]> {
        return this.siteLocationService.getAll();
    }

    @Get('/:id')
    async get(@Param('id') id: string,): Promise<SiteLocation[]> {
        return this.siteLocationService.get(id);
    }

    @Post()
    async register(
        @Headers('x-api-key') apiKey: string,
        @Body() body: { siteName: string; sitePolygon: { lat: number; lng: number }[] },
    ): Promise<SiteLocation> {
        if (apiKey !== this.configService.get<string>('ADMIN_API_KEY')) {
            throw new ForbiddenException('Invalid API Key');
        }
        return this.siteLocationService.registerSiteLocation(body.siteName, body.sitePolygon);
    }
}
