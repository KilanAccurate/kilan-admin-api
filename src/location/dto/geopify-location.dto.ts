import { IsOptional, IsString, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GeopifyLocationDto {
    @IsOptional() @IsString() name?: string;
    @IsOptional() @IsString() oldName?: string;
    @IsOptional() @IsString() country?: string;
    @IsOptional() @IsString() countryCode?: string;
    @IsOptional() @IsString() state?: string;
    @IsOptional() @IsString() county?: string;
    @IsOptional() @IsString() city?: string;
    @IsOptional() @IsString() postcode?: string;
    @IsOptional() @IsString() street?: string;
    @IsOptional() @IsString() housenumber?: string;
    @IsOptional() @IsNumber() lon?: number;
    @IsOptional() @IsNumber() lat?: number;
    @IsOptional() @IsString() stateCode?: string;
    @IsOptional() @IsNumber() distance?: number;
    @IsOptional() @IsString() resultType?: string;
    @IsOptional() @IsString() formatted?: string;
    @IsOptional() @IsString() addressLine1?: string;
    @IsOptional() @IsString() addressLine2?: string;
    @IsOptional() @IsString() category?: string;
    @IsOptional() @IsString() plusCode?: string;
    @IsOptional() @IsString() plusCodeShort?: string;
    @IsOptional() @IsString() placeId?: string;
}

export class CreateAbsensiDto {
    @IsOptional() @IsObject() startLocation?: Record<string, any>;
    @IsOptional() @IsObject() endLocation?: Record<string, any>;

    @IsOptional()
    @ValidateNested()
    @Type(() => GeopifyLocationDto)
    startPosition?: GeopifyLocationDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => GeopifyLocationDto)
    endPosition?: GeopifyLocationDto;

    @IsOptional() @IsString() remarks?: string;
}
