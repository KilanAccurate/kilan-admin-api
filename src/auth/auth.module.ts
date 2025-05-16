import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { User, UserSchema } from './model/user.model';
import { JwtStrategy } from './jwt.strategy';
import { SiteLocationService } from 'src/location/site-location.service';
import { SiteLocationModule } from 'src/location/site-location.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register User schema
        SiteLocationModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Ensure this is set correctly
            signOptions: { expiresIn: '1h' }, // Adjust expiry as needed
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy,],
    exports: [AuthService],
})
export class AuthModule { }
