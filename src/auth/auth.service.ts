import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './model/user.model';
import { generateJWT } from 'src/helper/jwt.helper';

@Injectable()
export class AuthService {
    users: User[] = [];
    login(fullName: string, password: string) {
        const user = this.users.find(u => u.fullName === fullName);

        if (!user || !User.verifyPassword(password, user.password)) {
            throw new BadRequestException('Invalid credentials');
        }

        const token = generateJWT(user.id, user.fullName);

        return {
            token,
            userId: user.id,
            fullName: user.fullName,
            site: user.site,
        };
    }

    signup(fullName: string, password: string, site: string): User {
        if (this.users.some(user => user.fullName === fullName)) {
            throw new Error('User already exists');
        }
        const newAuth = new User(fullName, password, site);
        this.users.push(newAuth);
        return newAuth;
    }

    editAuth(id: string, fullName?: string, password?: string, site?: string): { message: string; user: User } {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (fullName) user.fullName = fullName;
        if (password) user.password = User.hashPassword(password);
        if (site) user.site = site;

        return { message: 'User updated successfully', user };
    }

    deleteAuth(id: string): { message: string } {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) {
            throw new NotFoundException('User not found');
        }

        this.users.splice(index, 1);
        return { message: 'User deleted successfully' };
    }
}
