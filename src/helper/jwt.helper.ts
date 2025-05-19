import * as jwt from 'jsonwebtoken';
import { UserDocument } from '../auth/model/user.model';

export const generateJWT = (user: UserDocument): string => {
    const { password, ...userWithoutPassword } = user.toObject();

    const secret = process.env.JWT_SECRET;
    const options: jwt.SignOptions = { expiresIn: '1h' };

    return jwt.sign(userWithoutPassword, secret, options);
};
