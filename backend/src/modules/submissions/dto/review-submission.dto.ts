import { IsIn, IsOptional, IsString } from 'class-validator';

export class ReviewSubmissionDto {
    @IsIn(['approved', 'rejected'])
    status!: 'approved' | 'rejected';

    @IsOptional()
    @IsString()
    feedback?: string;
}