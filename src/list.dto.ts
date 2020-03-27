import { IsOptional, Max, Min } from 'class-validator';

export interface ListResultDto<E> {
    allEntities: number;
    entities: E[];
    page: number;
}

export class ListDto {
    @IsOptional()
    @Max(100)
    @Min(1)
    count: number = 10;

    @IsOptional()
    @Min(1)
    page: number = 1;
}
