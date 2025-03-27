import { ExceptionFilter, Catch, ArgumentsHost, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const errorResponse = exception.getResponse();

            response.status(status).json({
                statusCode: status,
                message: (errorResponse as any).message || 'An error occurred',
                error: (errorResponse as any).error || 'Bad Request',
            });
        } else {
            console.error('Unexpected error:', exception);
            response.status(500).json({
                statusCode: 500,
                message: 'Internal server error',
                error: 'Internal Server Error',
            });
        }
    }
}
