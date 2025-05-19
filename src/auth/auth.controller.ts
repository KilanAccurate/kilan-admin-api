import { Controller, Post, Put, Delete, Body, Param, UseGuards, Request, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
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

    @Put('edit/:userId')
    editAuth(
        @Param('userId') userId: string,
        @Body() dto: CreateUserDto
    ) {
        const result = this.authService.editAuth(userId, dto);
        return result;
    }

    @UseGuards(JwtAuthGuard) // Protect this route
    @Get('user')
    getUser(
        @Request() req,
    ) {
        console.log(req)
        const accountId = req.user._id;
        const result = this.authService.getUser(accountId);
        return result;
    }

    // @UseGuards(JwtAuthGuard) // Protect this route
    @Delete('delete/:userId')
    deleteAuth(@Param('userId') userId: string) {
        const result = this.authService.deleteAuth(userId);
        return result;
    }

    @UseGuards(JwtAuthGuard) // Protect this route
    @Put('update-fcm-token')
    async updateFcmToken(
        @Request() req,
        @Body('fcmToken') fcmToken: string,
    ) {
        const accountId = req.user._id
        return this.authService.updateFcmToken(accountId, fcmToken);
    }
}
