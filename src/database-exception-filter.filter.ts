import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { ValidationError } from '@mikro-orm/core';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(ValidationError)
export class DatabaseExceptionFilterFilter extends BaseExceptionFilter
    implements ExceptionFilter {
    private logger: Logger = new Logger(DatabaseExceptionFilterFilter.name);

    catch(exception: ValidationError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = 500;
        const message = exception.message;

        this.logger.error(message, exception.stack);

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
