import { IsDate, IsOptional, IsString, IsObject, IsBoolean, IsIn } from 'class-validator';

export class ApprovalData {
    @IsString()
    uid: string;

    @IsDate()
    approvedDate: Date;

    @IsString()
    userId: string;

    @IsIn(['approved', 'rejected'])
    approvalStatus: 'approved' | 'rejected';

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
}
