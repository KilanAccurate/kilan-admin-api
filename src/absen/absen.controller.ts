import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, Get, Put, Param, Query, Delete } from "@nestjs/common";
import { AbsensiService } from "./absen.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { ApprovalData, CreateAbsensiDto } from "./dto/absensi.dto";

@Controller('absensi')
export class AbsensiController {
    constructor(private readonly absensiService: AbsensiService) { }


    // TODO: Add list absensi for admin
    // TODO: Add list absensi detail for admin

    @UseGuards(JwtAuthGuard)
    @Post('list')
    async getUserAbsensiList(
        @Request() req,
        @Body() body: {
            startDate?: string;
            endDate?: string;
            type?: 'all' | 'lembur' | 'reguler';
            page?: number;
            limit?: number;
        }
    ) {
        const accountId = req.user._id;
        const parsedStartDate = body.startDate ? new Date(body.startDate) : undefined;
        const parsedEndDate = body.endDate ? new Date(body.endDate) : undefined;
        const type = body.type ?? 'all';
        const page = body.page ?? 1;
        const limit = body.limit ?? 25;

        return this.absensiService.getUserAbsensiList(
            accountId,
            parsedStartDate,
            parsedEndDate,
            type,
            page,
            limit
        );
    }

    @Post('admin/list/:accountId')
    async getAbsensiListForAdminByUser(
        @Param('accountId') accountId: string,
        @Body() body: {
            startDate?: string;
            endDate?: string;
            type?: 'all' | 'lembur' | 'reguler';
            page?: number;
            limit?: number;
        }
    ) {
        const parsedStartDate = body.startDate ? new Date(body.startDate) : undefined;
        const parsedEndDate = body.endDate ? new Date(body.endDate) : undefined;
        const type = body.type ?? 'all';
        const page = body.page ?? 1;
        const limit = body.limit ?? 25;

        return this.absensiService.getUserAbsensiList(
            accountId,
            parsedStartDate,
            parsedEndDate,
            type,
            page,
            limit
        );
    }


    @Get('admin/list')
    async getAbsensiListForAdmin(
        @Query('startDate') startDateStr?: string,
        @Query('endDate') endDateStr?: string,
        @Query('type') type: 'all' | 'lembur' | 'reguler' = 'all',
        @Query('page') page = '1',
        @Query('limit') limit = '25',
        @Query('search') search = '',
    ) {
        const startDate = startDateStr ? new Date(startDateStr) : undefined;
        const endDate = endDateStr ? new Date(endDateStr) : undefined;

        const pageNum = parseInt(page as string, 10) || 1;
        const limitNum = parseInt(limit as string, 10) || 25;

        return this.absensiService.getAbsensiListForAdmin(
            startDate,
            endDate,
            type,
            pageNum,
            limitNum,
            search,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getUserAbsensi(
        @Param('id') id: string,
        @Request() req) {
        const accountId = req.user.userId; // Extract accountId from JWT
        return this.absensiService.getUserAbsensi(accountId, id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('masuk')
    @UseInterceptors(FileInterceptor('startImgFile'))
    async absenMasuk(
        @Request() req, // Extract user from JWT
        @Body() absensiDto: CreateAbsensiDto,
        @UploadedFile() startImgFile?: Express.Multer.File,
    ) {
        const accountId = req.user._id; // Extract accountId from JWT
        return this.absensiService.absenMasuk(accountId, absensiDto, startImgFile);
    }

    @UseGuards(JwtAuthGuard)
    @Put('keluar/:id')
    @UseInterceptors(FileInterceptor('endImgFile'))
    async absenKeluar(
        @Param('id') id: string,
        @Request() req, // Extract user from JWT
        @Body() absensiDto: CreateAbsensiDto,
        @UploadedFile() endImgFile?: Express.Multer.File,
    ) {
        console.log(absensiDto)
        return this.absensiService.absenKeluar(absensiDto, endImgFile, id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('lembur/:id')
    @UseInterceptors(FileInterceptor('startImgFile'))
    async absenLembur(
        @Param('id') id: string,
        @Request() req, // Extract user from JWT
        @Body() absensiDto: CreateAbsensiDto,
        @UploadedFile() startImgFile?: Express.Multer.File,
    ) {
        console.log(absensiDto)
        const accountId = req.user._id;
        return this.absensiService.absenLembur(accountId, absensiDto, id, startImgFile);
    }

    @UseGuards(JwtAuthGuard)
    @Put('approval')
    async approveLembur(
        @Request() req,
        @Body() approvalData: ApprovalData,
    ) {
        const accountId = req.user._id;
        return this.absensiService.actionLemburan(accountId, approvalData);
    }

    @Delete(':id')
    async deleteAbsensiDanLembur(
        @Request() req,
        @Param('id') id: string,
    ) {
        return this.absensiService.deleteUserAbsensi(id);
    }

}
