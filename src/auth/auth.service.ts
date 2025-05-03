import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.model';
import { generateJWT } from 'src/helper/jwt.helper';
import { SiteLocationService } from 'src/location/site-location.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly siteLocationService: SiteLocationService) {

    }

    async login(dto: LoginDto) {
        const { fullName, password, site } = dto;

        try {
            const user = await this.userModel.findOne({ fullName });

            if (!user || !(await User.verifyPassword(password, user.password))) {
                return { status: 'error', statusCode: 400, message: 'Invalid credentials' };
            }

            const siteExists = await this.siteLocationService.get(user.site);
            if (!siteExists) {
                return { status: 'error', statusCode: 404, message: 'Assigned site no longer exists' };
            }

            if (user.site !== site) {
                return { status: 'error', statusCode: 400, message: 'Invalid credentials' };
            }

            const token = generateJWT(user.id, user.fullName, user.site);

            return {
                status: 'success',
                statusCode: 200,
                message: 'Login successful',
                data: {
                    token,
                    userId: user.id,
                    fullName: user.fullName,
                    siteId: user.site,
                },
            };
        } catch (error) {
            console.error('Login error:', error);
            return { status: 'error', statusCode: 500, message: 'Internal server error' };
        }
    }


    async signup(dto: CreateUserDto) {
        const { fullName, password, position, department, nik, site, phone, salary, role } = dto;

        const existingUser = await this.userModel.findOne({ fullName });
        if (existingUser) {
            return { status: 'error', statusCode: 400, message: 'User already exists' };
        }

        const siteExists = await this.siteLocationService.get(site?.uid || site);
        if (!siteExists) {
            return { status: 'error', statusCode: 404, message: 'Site does not exist' };
        }

        const hashedPassword = await User.hashPassword(password);

        const newUser = new this.userModel({
            fullName,
            password: hashedPassword,
            position,
            department,
            nik,
            site,
            phone,
            salary,
            role,
        });

        await newUser.save();

        return { status: 'success', statusCode: 201, message: 'Signup successful' };
    }

    async editAuth(id: string, createUserDto: CreateUserDto) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                return { status: 'error', statusCode: 404, message: 'User not found' };
            }

            // Update only the fields that are provided in createUserDto
            if (createUserDto.fullName) user.fullName = createUserDto.fullName;
            if (createUserDto.password) user.password = await User.hashPassword(createUserDto.password);
            if (createUserDto.site) user.site = createUserDto.site;

            // If department, position, or other fields are provided, they will also be updated
            if (createUserDto.position) user.position = createUserDto.position;
            if (createUserDto.department) user.department = createUserDto.department;
            if (createUserDto.nik) user.nik = createUserDto.nik;
            if (createUserDto.phone) user.phone = createUserDto.phone;
            if (createUserDto.salary) user.salary = createUserDto.salary;
            if (createUserDto.role) user.role = createUserDto.role;

            await user.save();

            return {
                status: 'success',
                statusCode: 200,
                message: 'User updated successfully',
                data: user,
            };
        } catch (error) {
            console.error('Edit Auth error:', error);
            return { status: 'error', statusCode: 500, message: 'Internal server error' };
        }
    }

    async deleteAuth(id: string) {
        try {
            const result = await this.userModel.findByIdAndDelete(id);
            if (!result) {
                return { status: 'error', statusCode: 404, message: 'User not found' };
            }

            return {
                status: 'success',
                statusCode: 200,
                message: 'User deleted successfully',
            };
        } catch (error) {
            console.error('Delete Auth error:', error);
            return { status: 'error', statusCode: 500, message: 'Internal server error' };
        }
    }

}
