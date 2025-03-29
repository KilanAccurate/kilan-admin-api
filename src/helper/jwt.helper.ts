import * as jwt from 'jsonwebtoken';

export const generateJWT = (userId: string, fullName: string, siteId: string): string => {
    const payload = { userId, fullName, siteId }; // Include the token in the payload
    const secret = process.env.JWT_SECRET;  // Replace with your environment variable or key management
    const options: jwt.SignOptions = { expiresIn: '1h' }; // Set expiration time for the JWT token

    return jwt.sign(payload, secret, options);
};
