import * as jwt from 'jsonwebtoken';

export const generateJWT = (userId: string, fullName: string): string => {
    const payload = { userId, fullName };
    const secret = 'your_secret_key';  // Replace with your environment variable or key management
    const options = { expiresIn: '1h' }; // Set expiration time for the JWT token

    return jwt.sign(payload, secret, options);
};
