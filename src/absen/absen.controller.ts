import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, Get, Put, Param } from "@nestjs/common";
import { AbsensiService } from "./absen.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { CreateAbsensiDto } from "./dto/absensi.dto";

@Controller('absensi')
export class AbsensiController {
    constructor(private readonly absensiService: AbsensiService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserAbsensiList(@Request() req) {
        const accountId = req.user.userId; // Extract accountId from JWT
        return this.absensiService.getUserAbsensiList(accountId);
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
        const accountId = req.user.userId; // Extract accountId from JWT
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
        return this.absensiService.absenKeluar(absensiDto, endImgFile, id);
    }


}
