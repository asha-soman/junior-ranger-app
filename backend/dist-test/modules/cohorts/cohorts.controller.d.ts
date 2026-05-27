import { InviteCodeService } from './invite-code.service';
import { CreateInviteCodeDto } from './dto/create-invite-code.dto';
import { Kysely } from 'kysely';
import { Database } from '../../database/interfaces/database.interface';
export declare class CohortsController {
    private readonly inviteCodeService;
    private readonly db;
    constructor(inviteCodeService: InviteCodeService, db: Kysely<Database>);
    createInviteCode(cohortId: string, dto: CreateInviteCodeDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        cohortId: string;
        code: string;
        expiryDate: Date;
        maxUsage: number;
        usedCount: number;
        active: boolean;
        createdBy: string;
    }>;
}
