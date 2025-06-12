import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, User, UserDocument } from './model/user.model';
import { generateJWT } from '../helper/jwt.helper';
import { SiteLocationService } from '../location/site-location.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly siteLocationService: SiteLocationService) {

    }

    async listUsers(query: {
        search?: string;
        role?: string;
        site?: string;
        sortBy?: 'asc' | 'desc';
        page?: number;
        limit?: number;
    }) {
        try {
            const {
                search,
                role,
                site,
                sortBy = 'asc',
                page = 1,
                limit = 10,
            } = query;

            const filter: any = {
                deletedAt: null, // Exclude soft-deleted users
            };

            if (search) {
                filter.fullName = { $regex: search, $options: 'i' };
            }

            if (role) {
                filter.role = role;
            }

            if (site) {
                filter['site._id'] = site;
            }

            const sortOption = sortBy === 'asc' ? 1 : -1;
            const skip = (page - 1) * limit;

            const [users, total] = await Promise.all([
                this.userModel
                    .find(filter)
                    .select('-password')
                    .sort({ createdAt: sortOption })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                this.userModel.countDocuments(filter),
            ]);

            return {
                status: 'success',
                statusCode: 200,
                message: 'Users fetched successfully',
                data: users,
                pagination: {
                    total,
                    page,
                    limit,
                    isMax: page * limit >= total,
                },
            };
        } catch (error) {
            console.error('List Users error:', error);
            return {
                status: 'error',
                statusCode: 500,
                message: 'Internal server error',
            };
        }
    }


    async getUserById(userId: string) {
        try {
            const user = await this.userModel.findOne({
                _id: userId,
                deletedAt: null, // Exclude soft-deleted users
            }).lean();

            if (!user) {
                return {
                    status: 'error',
                    statusCode: 404,
                    message: 'User not found',
                };
            }

            return {
                status: 'success',
                statusCode: 200,
                message: 'User fetched successfully',
                data: user,
            };
        } catch (error) {
            console.error('Get User by ID error:', error);
            return {
                status: 'error',
                statusCode: 500,
                message: 'Internal server error',
            };
        }
    }


    async login(dto: LoginDto) {
        const { fullName, password, site, isAdmin, fcmToken } = dto;

        try {
            const user = await this.userModel.findOne({
                fullName,
                deletedAt: null, // Exclude soft-deleted users
            });

            if (!user || !(await User.verifyPassword(password, user.password))) {
                return {
                    status: 'error',
                    statusCode: 400,
                    message: 'Invalid credentials',
                };
            }

            // Optional: Uncomment if you want to validate the assigned site
            // const siteExists = await this.siteLocationService.get(site);
            // if (!siteExists.data && !isAdmin) {
            //     return { status: 'error', statusCode: 404, message: 'Assigned site no longer exists' };
            // }

            // if (user.site._id.toString() !== site && !isAdmin) {
            //     return { status: 'error', statusCode: 400, message: 'Invalid credentials' };
            // }

            // Update FCM token in DB if provided
            if (fcmToken) {
                user.fcmToken = fcmToken;
                await user.save();
            }

            // Check admin access rights
            if (
                isAdmin === true &&
                ![Role.PJO, Role.Admin, Role.Manager, Role.HRD].includes(user.role)
            ) {
                return {
                    status: 'error',
                    statusCode: 403,
                    message: 'You do not have admin privileges',
                };
            }

            const token = generateJWT(user);

            return {
                status: 'success',
                statusCode: 200,
                message: 'Login successful',
                data: {
                    token,
                    ...user.toObject(),
                },
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                status: 'error',
                statusCode: 500,
                message: 'Internal server error',
            };
        }
    }


    async signup(dto: CreateUserDto) {
        const {
            fullName,
            password,
            position,
            department,
            nik,
            site,
            phone,
            salary,
            role,
        } = dto;

        // Only block signup if a non-deleted user with the same fullName exists
        const existingUser = await this.userModel.findOne({
            fullName,
            deletedAt: null, // Ignore soft-deleted users
        });

        if (existingUser) {
            return {
                status: 'error',
                statusCode: 400,
                message: 'User already exists',
            };
        }

        const siteExists = await this.siteLocationService.get(site);
        if (!siteExists.data) {
            return {
                status: 'error',
                statusCode: 404,
                message: 'Site does not exist',
            };
        }

        const hashedPassword = await User.hashPassword(password);

        const newUser = new this.userModel({
            fullName,
            password: hashedPassword,
            position,
            department,
            nik,
            site: siteExists.data,
            phone,
            salary,
            role,
        });

        await newUser.save();

        return {
            status: 'success',
            statusCode: 201,
            message: 'Signup successful',
        };
    }


    async getUser(userId: string) {
        try {
            const user = await this.userModel.findOne({
                _id: userId,
                deletedAt: null, // Exclude soft-deleted users
            }).lean();

            if (!user) {
                return {
                    status: 'error',
                    statusCode: 404,
                    message: 'User not found',
                };
            }

            return {
                status: 'success',
                statusCode: 200,
                message: 'User fetched successfully',
                data: user,
            };
        } catch (error) {
            console.error('Get User by ID error:', error);
            return {
                status: 'error',
                statusCode: 500,
                message: 'Internal server error',
            };
        }
    }


    async editAuth(id: string, createUserDto: CreateUserDto) {
        try {
            const user = await this.userModel.findOne({ _id: id, deletedAt: null }); // Exclude soft-deleted users
            if (!user) {
                return { status: 'error', statusCode: 404, message: 'User not found' };
            }

            const siteExists = await this.siteLocationService.get(createUserDto.site);
            if (!siteExists.data) {
                return { status: 'error', statusCode: 404, message: 'Site does not exist' };
            }

            // Update only the fields that are provided in createUserDto
            if (createUserDto.fullName) user.fullName = createUserDto.fullName;
            if (createUserDto.password) user.password = await User.hashPassword(createUserDto.password);
            if (createUserDto.site) user.site = siteExists.data;
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
            const result = await this.userModel.findByIdAndUpdate(
                id,
                { deletedAt: new Date() },
                { new: true }
            );

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


    async updateFcmToken(userId: string, fcmToken: string, fcmTokenIssuedAt?: string) {
        try {
            const user = await this.userModel.findOne({ _id: userId, deletedAt: null }); // Exclude soft-deleted users
            if (!user) {
                throw new NotFoundException('User not found');
            }

            user.fcmToken = fcmToken;

            if (fcmTokenIssuedAt) {
                const issuedAt = new Date(fcmTokenIssuedAt);
                const TTL_DAYS = 30;
                const expiresAt = new Date(issuedAt.getTime() + TTL_DAYS * 24 * 60 * 60 * 1000);
                user.fcmTokenExpiresAt = expiresAt;
            }

            await user.save();

            return {
                status: 'success',
                statusCode: 200,
                message: 'FCM Token updated successfully',
            };
        } catch (error) {
            console.error('Update FCM token error:', error);
            return {
                status: 'error',
                statusCode: 500,
                message: 'Internal server error',
            };
        }
    }

}
