import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';

@Module({
    imports: [ConfigModule],
    providers: [CloudinaryProvider, CloudinaryService], // ✅ Include CloudinaryService here
    exports: [CloudinaryService], // ✅ Now it's valid to export
})
export class CloudinaryModule { }
