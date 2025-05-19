import { IsDate, IsOptional, IsString, IsObject, IsBoolean, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SiteLocation } from '../../location/schemas/site-location.schema';

export class ApprovalData {
    @IsOptional()
    @IsString()
    uid: string;

    @IsOptional()
    @IsDate()
    approvedDate: Date;

    @IsOptional()
    @IsString()
    userId: string;

    @IsOptional()
    @IsString()
    remarks: string;

    @IsOptional()
    @IsIn(['approved', 'rejected'])
    approvalStatus: 'approved' | 'rejected';

    @IsOptional()
    @IsIn(['pjo', 'manager', 'hrd'])
    role: 'pjo' | 'manager' | 'hrd';
}

export class CreateAbsensiDto {
    @IsDate()
    startDate: Date;

    @IsOptional()
    @IsDate()
    endDate?: Date;

    @IsOptional()
    @IsDate()
    requestedDate?: Date;

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

    @IsOptional()
    @IsBoolean()
    isOverTime?: boolean;

    @IsOptional()
    @IsObject()
    pjoApproval?: ApprovalData;

    @IsOptional()
    @IsObject()
    managerApproval?: ApprovalData;

    @IsOptional()
    @IsObject()
    hrdApproval?: ApprovalData;

    @IsOptional()
    @IsString()
    detectedSite?: string;

    @IsOptional()
    @IsString()
    otType?: string;
}
