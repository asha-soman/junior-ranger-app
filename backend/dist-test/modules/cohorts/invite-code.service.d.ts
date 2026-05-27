import { Kysely } from 'kysely';
import { Database } from '../../database/interfaces/database.interface';
import { CreateInviteCodeDto } from './dto/create-invite-code.dto';
import { ValidateInviteCodeDto } from './dto/validate-invite-code.dto';
import { JoinCohortDto } from './dto/join-cohort.dto';
import { InviteCode } from './interfaces/invite-code.interface';
export declare class InviteCodeService {
    private readonly db;
    constructor(db: Kysely<Database>);
    generateInviteCode(cohortId: string, userId: string, dto: CreateInviteCodeDto): Promise<InviteCode>;
    validateInviteCode(dto: ValidateInviteCodeDto): Promise<{
        inviteCode: {
            id: string;
            createdAt: Date;
            cohortId: string;
            code: string;
            expiryDate: Date;
            maxUsage: number;
            usedCount: number;
            active: boolean;
            createdBy: string;
        };
        cohort: {
            id: string;
            name: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            location: string | null;
            assignedRangerId: string | null;
            createdByRangerId: string | null;
            imageUrl: string | null;
        };
    }>;
    joinCohort(userId: string, dto: JoinCohortDto): Promise<{
        success: boolean;
        cohortName: string;
    }>;
}
