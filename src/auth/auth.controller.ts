import { Controller, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { formatResponse } from 'src/helper/response.helper';

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
        return formatResponse('success', 201, 'Auth signed up successfully', result);
    }

    @Post('login')
    login(@Body('fullName') fullName: string, @Body('password') password: string) {
        const result = this.authService.login(fullName, password);
        return formatResponse('success', 200, 'Login successful', result);
    }

    @Put('edit/:id')
    editAuth(
        @Param('id') id: string,
        @Body('fullName') fullName?: string,
        @Body('password') password?: string,
        @Body('site') site?: string,
    ) {
        const result = this.authService.editAuth(id, fullName, password, site);
        return formatResponse('success', 200, 'Auth updated successfully', result);
    }

    @Delete('delete/:id')
    deleteAuth(@Param('id') id: string) {
        const result = this.authService.deleteAuth(id);
        return formatResponse('success', 200, 'Auth deleted successfully', result);
    }
}
