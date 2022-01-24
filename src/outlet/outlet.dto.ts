import {
    IsBoolean,
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

    @IsOptional({ groups: ['update', 'create'] })
    @IsNumber({}, { always: true })
    @IsIn([1, 2, 3, 4], { always: true })
    nativeChannel2?: number;

    @IsOptional({ always: true })
    @IsBoolean({ always: true })
    multiChannel?: boolean;

    @IsOptional({ always: true })
    @IsString({ always: true })
    homeAssistantType?: string;
}
