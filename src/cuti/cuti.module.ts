import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CutiModel } from './schema/cuti.schema';
import { CutiService } from './cuti.service';
import { CutiController } from './cuti.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { FcmModule } from 'src/firebase/fcm/fcm.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Cuti', schema: CutiModel.schema },],),
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
