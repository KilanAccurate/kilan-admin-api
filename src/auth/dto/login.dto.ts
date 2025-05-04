import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    site: string;

    @IsString()
    fcmToken: string;

    @IsBoolean()
    isAdmin: boolean;
}
