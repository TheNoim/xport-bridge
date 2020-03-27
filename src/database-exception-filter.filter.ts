import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    NotFoundException,
    Response,
} from '@nestjs/common';
import { ValidationError } from 'mikro-orm';
import {BaseExceptionFilter} from "@nestjs/core";

@Catch(ValidationError)
export class DatabaseExceptionFilterFilter extends BaseExceptionFilter implements ExceptionFilter {
    catch(exception: ValidationError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = 500;
        const message = exception.message;

        if (message.includes('not found')) {
            const notFound = new NotFoundException(message);
            super.catch(notFound, host);
        } else {
            response.status(status).json({
                statusCode: status,
                error: exception.name,
                message,
            });
        }
    }
}
