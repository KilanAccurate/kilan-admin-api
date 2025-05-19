import { Type } from "class-transformer";
import { IsDate, IsEnum, IsString, IsArray, IsNumber, IsOptional } from "class-validator";
import { ApprovalData } from "../../absen/dto/absensi.dto";

export class CreateCutiDto {
    @IsDate()
    tanggalMasuk: Date;

    @IsDate()
    mulaiCuti: Date;

    @IsDate()
    kembaliBekerja: Date;

    @IsEnum(['lokal', 'nonLokal'])
    poh: 'lokal' | 'nonLokal';

    @IsString()
    rosterCuti: string;

    @IsString()
    tujuanCuti: string;

    @IsArray()
    @IsString({ each: true })
    pekerjaanDiserahkanPada: string[];

    @IsString()
    transport: string;

    @IsNumber()
    sisaHariCuti: number;

    @IsString()
    keterangan: string;

    @IsOptional()
    @Type(() => ApprovalData)
    status?: ApprovalData;
}
