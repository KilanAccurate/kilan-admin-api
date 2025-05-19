import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CutiModel } from './schema/cuti.schema';
import { CutiService } from './cuti.service';
import { CutiController } from './cuti.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { FcmModule } from '../firebase/fcm/fcm.module';
import { User, UserSchema } from '../auth/model/user.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Cuti', schema: CutiModel.schema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Ensure this is set correctly
            signOptions: { expiresIn: '1h' }, // Adjust expiry as needed
        }),
        AuthModule,
        FcmModule,
    ],
    controllers: [CutiController],
    providers: [CutiService, JwtStrategy],
})
export class CutiModule { }
