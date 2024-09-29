import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const stackArr = exception.stack.split("\n");
        const stack = stackArr.map(s => {
            return s.split(' ').join('')
        });
        let hoursMinSecondTime = new Date().toLocaleTimeString('cs-CZ', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'

        });

        const errorResponse = {
            code: status,
            timestamp: `${new Date().toLocaleDateString()}, ${hoursMinSecondTime}`,
            path: request.url,
            method: request.method,
            message:
                status !== HttpStatus.INTERNAL_SERVER_ERROR
                    ? exception.message || exception.message || null
                    : exception.message || exception.message || null,//'Internal server error',
            stack: stack
        };

        response.status(status).json(errorResponse);
    }
}