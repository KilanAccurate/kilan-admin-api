import { IsDate, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateAbsensiDto {
    @IsDate()
    startDate: Date;

    @IsOptional()
    @IsDate()
    endDate?: Date;

    @IsOptional()
    @IsString()
    startImgUrl?: string;

    @IsOptional()
    @IsString()
    startImgId?: string;

    @IsOptional()
    @IsString()
    endImgUrl?: string;

    @IsOptional()
    @IsString()
    endImgId?: string;

    @IsOptional()
    @IsObject()
    startLocation?: Record<string, any>;

    @IsOptional()
    @IsObject()
    endLocation?: Record<string, any>;

    @IsOptional()
    @IsObject()
    startPosition?: Record<string, any>;

    @IsOptional()
    @IsObject()
    endPosition?: Record<string, any>;

    @IsOptional()
    @IsString()
    remarks?: string;
}
