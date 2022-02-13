import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import { AppModule } from './app.module';
import {DatabaseExceptionFilterFilter} from "./database-exception-filter.filter";
import { ExceptionHandler } from './exception-handler';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const { httpAdapter } = app.get(HttpAdapterHost);

    app.useGlobalFilters(new DatabaseExceptionFilterFilter(httpAdapter), new ExceptionHandler());

    await app.listen(3000);
}
bootstrap();
