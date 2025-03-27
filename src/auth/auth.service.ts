import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.model';
import { generateJWT } from 'src/helper/jwt.helper';
import { SiteLocationService } from 'src/location/site-location.service';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly siteLocationService: SiteLocationService) {

    }

    async login(fullName: string, password: string) {
        try {
            const user = await this.userModel.findOne({ fullName });

            if (!user || !(await User.verifyPassword(password, user.password))) {
                return { status: 'error', statusCode: 400, message: 'Invalid credentials' };
            }

            // Verify if the site exists by ID
            const siteExists = await this.siteLocationService.get(user.site);
            if (!siteExists) {
                return { status: 'error', statusCode: 404, message: 'Assigned site no longer exists' };
            }

            const token = generateJWT(user.id, user.fullName);

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

    async signup(fullName: string, password: string, siteId: string) {
        try {
            const existingUser = await this.userModel.findOne({ fullName });
            if (existingUser) {
                return { status: 'error', statusCode: 400, message: 'User already exists' };
            }

            // Verify if the site exists by ID before allowing signup
            const siteExists = await this.siteLocationService.get(siteId);
            if (!siteExists) {
                return { status: 'error', statusCode: 404, message: 'Site does not exist' };
            }

            const hashedPassword = await User.hashPassword(password);
            const newUser = new this.userModel({ fullName, password: hashedPassword, site: siteId });

            await newUser.save();

            return { status: 'success', statusCode: 201, message: 'Signup successful' };
        } catch (error) {
            console.error('Signup error:', error);
            return { status: 'error', statusCode: 500, message: 'Internal server error' };
        }
    }


    async editAuth(id: string, fullName?: string, password?: string, site?: string) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                return { status: 'error', statusCode: 404, message: 'User not found' };
            }

            if (fullName) user.fullName = fullName;
            if (password) user.password = await User.hashPassword(password);
            if (site) user.site = site;

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
