import { Controller, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { formatResponse } from 'src/helper/response.helper';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signup(
        @Body('fullName') fullName: string,
        @Body('password') password: string,
        @Body('site') site: string,
    ) {
        const result = this.authService.signup(fullName, password, site);
        return result;
    }

    @Post('login')
    login(@Body('fullName') fullName: string, @Body('password') password: string, @Body('site') site: string) {
        const result = this.authService.login(fullName, password, site);
        return result;
    }

    @UseGuards(JwtAuthGuard) // Protect this route
    @Put('edit')
    editAuth(
        @Request() req,
        @Body('fullName') fullName?: string,
        @Body('password') password?: string,
        @Body('site') site?: string,
    ) {
        const accountId = req.user.userId;
        const result = this.authService.editAuth(accountId, fullName, password, site);
        return result;
    }

    @UseGuards(JwtAuthGuard) // Protect this route
    @Delete('delete')
    deleteAuth(@Request() req,) {
        const accountId = req.user.userId
        const result = this.authService.deleteAuth(accountId);
        return result;
    }
}
