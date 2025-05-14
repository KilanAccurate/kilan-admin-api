import { MongooseModule } from "@nestjs/mongoose";
import { AbsensiController } from "./absen.controller";
import { AbsensiService } from "./absen.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { AbsensiSchema } from "./schemas/absensi.schema";
import { Module } from "@nestjs/common";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { CloudinaryProvider } from "src/cloudinary/cloudinary.provider";
import { MediaSchema } from "src/cloudinary/schemas/media.schema";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";
import { ConfigModule } from "@nestjs/config";
import { FcmModule } from "src/firebase/fcm/fcm.module";
import { User, UserSchema } from "src/auth/model/user.model";
import { SiteLocation, SiteLocationSchema } from "src/location/schemas/site-location.schema";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: 'Absensi', schema: AbsensiSchema }],),
        MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: SiteLocation.name, schema: SiteLocationSchema }]),
        CloudinaryModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Ensure this is set correctly
            signOptions: { expiresIn: '1h' }, // Adjust expiry as needed
        }),
        FcmModule,
    ],
    controllers: [AbsensiController],
    providers: [AbsensiService, JwtStrategy, CloudinaryProvider],
    exports: [AbsensiService]
})
export class AbsensiModule { }