import {
    ArgumentsHost, Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus, Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionHandler extends BaseExceptionFilter implements ExceptionFilter  {
    private logger: Logger = new Logger(ExceptionHandler.name);

    catch(exception: Error, host: ArgumentsHost): any {
        let status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = `An error occurred with status ${status}`;

        if (exception.message) {
            message += `: ${exception.message}`;
        }

        this.logger.error(message, exception.stack);

        return super.catch(exception, host);
    }
}
