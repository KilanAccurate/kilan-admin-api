import { Controller, Post, Put, Delete, Body, Param, UseGuards, Request, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { formatResponse } from 'src/helper/response.helper';
import { JwtAuthGuard } from './jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('list')
    async getUsers(@Query() query) {
        return this.authService.listUsers(query);
    }

    @Get('users/:userId')
    async getUserById(@Param('userId') userId: string) {
        return this.authService.getUserById(userId);
    }


    @Post('signup')
    signup(@Body() dto: CreateUserDto) {
        return this.authService.signup(dto);
    }


    @Post('login')
    login(@Body() dto: LoginDto) {
        const result = this.authService.login(dto);
        return result;
    }

    @UseGuards(JwtAuthGuard) // Protect this route
    @Put('edit')
    editAuth(
        @Request() req,
        @Body() dto: CreateUserDto
    ) {
        const accountId = req.user.userId;
        const result = this.authService.editAuth(accountId, dto);
        return result;
    }

    @UseGuards(JwtAuthGuard) // Protect this route
    @Delete('delete')
    deleteAuth(@Request() req,) {
        const accountId = req.user.userId
        const result = this.authService.deleteAuth(accountId);
        return result;
    }

    @UseGuards(JwtAuthGuard) // Protect this route
    @Put('update-fcm-token')
    async updateFcmToken(
        @Request() req,
        @Body('fcmToken') fcmToken: string,
    ) {
        const accountId = req.user.userId
        return this.authService.updateFcmToken(accountId, fcmToken);
    }
}
