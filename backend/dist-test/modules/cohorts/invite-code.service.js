"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteCodeService = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const crypto = require("crypto");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
let InviteCodeService = class InviteCodeService {
    db;
    constructor(db) {
        this.db = db;
    }
    async generateInviteCode(cohortId, userId, dto) {
        const cohort = await this.db
            .selectFrom('cohorts')
            .selectAll()
            .where('id', '=', cohortId)
            .executeTakeFirst();
        if (!cohort) {
            throw new common_1.NotFoundException(`Cohort with ID ${cohortId} not found`);
        }
        let code = '';
        let isUnique = false;
        while (!isUnique) {
            code = crypto.randomBytes(4).toString('hex').toUpperCase();
            const existing = await this.db
                .selectFrom('invite_codes')
                .where('code', '=', code)
                .executeTakeFirst();
            if (!existing) {
                isUnique = true;
            }
        }
        const expiryDate = dto.expiryDate
            ? new Date(dto.expiryDate)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const maxUsage = dto.maxUsage ?? 10;
        const result = await this.db
            .insertInto('invite_codes')
            .values({
            cohortId,
            code,
            expiryDate,
            maxUsage,
            createdBy: userId,
        })
            .returningAll()
            .executeTakeFirstOrThrow();
        return result;
    }
    async validateInviteCode(dto) {
        const invite = await this.db
            .selectFrom('invite_codes')
            .selectAll()
            .where('code', '=', dto.code)
            .executeTakeFirst();
        if (!invite) {
            throw new common_1.NotFoundException('Invite code not found');
        }
        if (!invite.active) {
            throw new common_1.BadRequestException('Invite code is no longer active');
        }
        if (new Date() > new Date(invite.expiryDate)) {
            throw new common_1.BadRequestException('Invite code has expired');
        }
        if (invite.usedCount >= invite.maxUsage) {
            throw new common_1.BadRequestException('Invite code usage limit reached');
        }
        const cohort = await this.db
            .selectFrom('cohorts')
            .selectAll()
            .where('id', '=', invite.cohortId)
            .executeTakeFirst();
        if (!cohort) {
            throw new common_1.NotFoundException('Associated cohort not found');
        }
        return {
            inviteCode: invite,
            cohort: cohort,
        };
    }
    async joinCohort(userId, dto) {
        const { inviteCode, cohort } = await this.validateInviteCode({ code: dto.code });
        const existingMember = await this.db
            .selectFrom('cohort_members')
            .selectAll()
            .where('userId', '=', userId)
            .where('cohortId', '=', cohort.id)
            .executeTakeFirst();
        if (existingMember) {
            throw new common_1.BadRequestException('You are already a member of this cohort');
        }
        return await this.db.transaction().execute(async (trx) => {
            await trx
                .insertInto('cohort_members')
                .values({
                userId,
                cohortId: cohort.id,
                role: user_role_enum_1.UserRole.JUNIOR_RANGER,
            })
                .execute();
            await trx
                .updateTable('invite_codes')
                .set((eb) => ({
                usedCount: eb('usedCount', '+', 1),
            }))
                .where('id', '=', inviteCode.id)
                .execute();
            return { success: true, cohortName: cohort.name };
        });
    }
};
exports.InviteCodeService = InviteCodeService;
exports.InviteCodeService = InviteCodeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [kysely_1.Kysely])
], InviteCodeService);
//# sourceMappingURL=invite-code.service.js.map