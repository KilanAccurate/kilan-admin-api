export const formatResponse = (
    status: 'success' | 'error',
    statusCode: number,
    message: string,
    data: any = null
) => ({
    status,
    statusCode,
    message,
    data,
});