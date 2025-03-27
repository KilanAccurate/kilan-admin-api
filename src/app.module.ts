import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SiteLocationModule } from './location/site-location.module';
import { CloudinaryController } from './cloudinary/cloudinary.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { AbsensiModule } from './absen/absen.module';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';

@Module({
  controllers: [CloudinaryController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }), // Load environment variables from .env
    MongooseModule.forRoot(process.env.MONGODB_URI), // Connect to MongoDB
    AuthModule,
    SiteLocationModule,
    CloudinaryModule,
    AbsensiModule,
  ],
  providers: [CloudinaryProvider, CloudinaryService],
})
export class AppModule { }
