import { IsString, IsNotEmpty, IsObject, IsPhoneNumber, IsNumber, IsIn } from 'class-validator';
import { Role } from '../model/user.model';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    position: string;

    @IsString()
    @IsNotEmpty()
    department: string;

    @IsString()
    @IsNotEmpty()
    nik: string;

    @IsString()
    @IsNotEmpty()
    site: string;

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber(null) // or use regex if needed
    phone: string;

    @IsNumber()
    salary: number;

    @IsIn(Object.values(Role))
    role: Role;
}
