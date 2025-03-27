import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteLocationController } from '../location/site-location.controller';
import { SiteLocationService } from '../location/site-location.service';
import { SiteLocation, SiteLocationSchema } from '../location/schemas/site-location.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: SiteLocation.name, schema: SiteLocationSchema }]),
    ],
    controllers: [SiteLocationController],
    providers: [SiteLocationService],
    exports: [SiteLocationService], // Exporting to be used in other modules if needed
})
export class SiteLocationModule { }
