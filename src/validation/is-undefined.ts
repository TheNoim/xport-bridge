import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUndefined', async: false })
export class IsUndefinedConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        console.log(JSON.stringify(args));
        return value === undefined;
    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        return 'The value needs to be undefined.';
    }
}

export function IsUndefined(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUndefinedConstraint,
        });
    };
}
