import { InviteCodeService } from './invite-code.service';
import { ValidateInviteCodeDto } from './dto/validate-invite-code.dto';
import { JoinCohortDto } from './dto/join-cohort.dto';
export declare class InviteCodesController {
    private readonly inviteCodeService;
    constructor(inviteCodeService: InviteCodeService);
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
    joinCohort(dto: JoinCohortDto, req: any): Promise<{
        success: boolean;
        cohortName: string;
    }>;
}
