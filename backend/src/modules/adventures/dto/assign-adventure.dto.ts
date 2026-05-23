import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignAdventureDto {
    @IsString()
    @IsNotEmpty()
    adventureId!: string;

    @IsArray()
    @IsString({ each: true })
    cohortIds!: string[];
}