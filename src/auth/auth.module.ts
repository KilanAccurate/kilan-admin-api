import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { User, UserSchema } from './model/user.model';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigModule } from '@nestjs/config';
import { SiteLocationModule } from '../location/site-location.module';

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
