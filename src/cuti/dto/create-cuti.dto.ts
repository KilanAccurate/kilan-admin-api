import { Type } from "class-transformer";
import { IsDate, IsEnum, IsString, IsArray, ValidateNested, IsNumber, IsOptional } from "class-validator";
import { ApprovalData } from "src/absen/dto/absensi.dto";
import { User } from "src/auth/model/user.model";

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
    @ValidateNested({ each: true })
    @Type(() => User)
    pekerjaanDiserahkanPada: User[];

    @IsString()
    transport: string;

    @IsNumber()
    sisaHariCuti: number;

    @IsString()
    keterangan: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => ApprovalData)
    status?: ApprovalData;
}
