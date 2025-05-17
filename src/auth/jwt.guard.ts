import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            console.log('No Authorization header found');
            throw new UnauthorizedException();
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('Token missing in Authorization header');
            throw new UnauthorizedException();
        }

        try {
            const decoded = this.jwtService.verify(token);
            request.user = decoded; // Attach user info
            // console.log('Decoded user:', decoded);
            return true;
        } catch (error) {
            console.log('JWT verification failed:', error.message);
            throw new UnauthorizedException();
        }
    }
}
