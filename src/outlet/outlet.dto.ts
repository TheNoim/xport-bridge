import {
    IsAlphanumeric,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class OutletDto {
    @IsOptional({ groups: ['update'] })
    @IsString({ groups: ['create'] })
    name?: string;

    @IsOptional({ always: true })
    @IsString({ always: true })
    description?: string;

    @IsOptional({ groups: ['update'] })
    @IsNumber({}, { always: true })
    nativeAddress?: number;

    @IsOptional({ groups: ['update'] })
    @IsNumber({}, { always: true })
    @IsIn([1, 2, 3, 4], { always: true })
    nativeChannel?: number;
}
