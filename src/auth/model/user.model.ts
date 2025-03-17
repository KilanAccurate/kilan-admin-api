import * as crypto from 'crypto';

export class User {
    id: string;
    fullName: string;
    password: string;
    site: string;

    constructor(fullName: string, password: string, site: string) {
        this.id = User.generateId();
        this.fullName = fullName;
        this.password = User.hashPassword(password);
        this.site = site;
    }

    private static generateId(): string {
        return crypto.randomBytes(8).toString('hex');
    }

    public static hashPassword(password: string): string {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    public static verifyPassword(password: string, hashedPassword: string): boolean {
        return User.hashPassword(password) === hashedPassword;
    }
}