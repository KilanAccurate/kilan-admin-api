import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CutiModel } from './schema/cuti.schema';
import { CutiService } from './cuti.service';
import { CutiController } from './cuti.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Cuti', schema: CutiModel.schema }])],
    controllers: [CutiController],
    providers: [CutiService],
})
export class CutiModule { }
