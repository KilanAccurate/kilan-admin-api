import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            console.log('No Authorization header found');
            throw new UnauthorizedException('Authorization header missing');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('Token missing in Authorization header');
            throw new UnauthorizedException('Token missing');
        }

        try {
            const decoded = this.jwtService.verify(token); // will throw if expired
            request.user = decoded;
            return true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                console.log('JWT token expired:', error.message);
                throw new UnauthorizedException('Token expired');
            }
            console.log('JWT verification failed:', error.message);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
