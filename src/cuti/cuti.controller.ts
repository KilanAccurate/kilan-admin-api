
// cuti.controller.ts
import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CutiService } from './cuti.service';
import { CreateCutiDto } from './dto/create-cuti.dto';
import { ApprovalData } from '../absen/dto/absensi.dto';

@Controller('cuti')
export class CutiController {
    constructor(private readonly cutiService: CutiService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async applyCuti(
        @Request() req,
        @Body() dto: CreateCutiDto,
    ) {
        const accountId = req.user._id;
        return this.cutiService.applyCuti(accountId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('list')
    async getUserCutiList(
        @Request() req,
        @Body('status') status: 'all' | 'pending' | 'approved' | 'rejected' = 'all',
        @Body('page') page = 1,
        @Body('limit') limit = 25,
    ) {
        const accountId = req.user._id;
        return this.cutiService.getUserCutiList(accountId, status, page, limit);
    }

    @UseGuards(JwtAuthGuard)
    @Put('action')
    async approveCuti(
        @Request() req,
        @Body() approvalData: ApprovalData,
    ) {
        const accountId = req.user._id;
        return this.cutiService.actionCuti(accountId, approvalData);
    }

    @Post('admin/list')
    async getAllCutiList(
        @Body('status') status: 'all' | 'pending' | 'approved' | 'rejected' = 'all',
        @Body('page') page = 1,
        @Body('limit') limit = 25,
    ) {
        return this.cutiService.getCutiList(status, page, limit);
    }

    @UseGuards(JwtAuthGuard)
    @Get('detail/:id')
    async getUserCutiDetail(@Request() req, @Param('id') id: string) {
        const accountId = req.user._id;
        return this.cutiService.getUserCutiDetail(accountId, id);
    }

    @Get('admin/detail/:id')
    async getAdminCutiDetail(@Param('id') id: string) {
        return this.cutiService.getCutiDetail(id);
    }

}
