import { ValidationPipe } from '@nestjs/common';
import {ValidationOptions} from "class-validator";
import {TransformOptions} from "class-transformer";

export function Validation(group?: string) {
    const additionalOptions: ValidationOptions = {};
    const additionalTransformOptions: TransformOptions = {};
    if (group) {
        additionalOptions.groups = [group];
        additionalTransformOptions.groups = [group];
    }
    return new ValidationPipe({
        ...additionalOptions,
        transform: true,
        validateCustomDecorators: true,
        skipMissingProperties: false,
        transformOptions: {
            ...additionalTransformOptions
        }
    });
}
