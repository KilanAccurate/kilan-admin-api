
// cuti.controller.ts
import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CutiService } from './cuti.service';
import { CreateCutiDto } from './dto/create-cuti.dto';
import { ApprovalData } from 'src/absen/dto/absensi.dto';

@Controller('cuti')
@UseGuards(JwtAuthGuard)
export class CutiController {
    constructor(private readonly cutiService: CutiService) { }

    @Post()
    async applyCuti(
        @Request() req,
        @Body() dto: CreateCutiDto,
    ) {
        const accountId = req.user.userId;
        return this.cutiService.applyCuti(accountId, dto);
    }

    @Post('list')
    async getUserCutiList(
        @Request() req,
        @Body('status') status: 'pending' | 'approved' | 'rejected' = 'pending',
        @Body('page') page = 1,
        @Body('limit') limit = 25,
    ) {
        const accountId = req.user.userId;
        return this.cutiService.getUserCutiList(accountId, status, page, limit);
    }


    @Patch('approve/:id')
    async approveCuti(
        @Param('id') id: string,
        @Body() approvalData: ApprovalData,
    ) {
        return this.cutiService.approveCuti(id, approvalData);
    }
}