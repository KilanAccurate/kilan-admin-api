import { IsString, IsNotEmpty, IsObject, IsPhoneNumber, IsNumber, IsIn } from 'class-validator';

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

    @IsObject()
    @IsNotEmpty()
    department: { uid: string, departmentName: string }; // Department is directly an object with uid and departmentName

    @IsString()
    @IsNotEmpty()
    nik: string;

    @IsObject()
    @IsNotEmpty()
    site: any;

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('ID') // or use regex if needed
    phone: string;

    @IsNumber()
    salary: number;

    @IsIn(['superior', 'staff', 'admin'])
    role: string;
}
