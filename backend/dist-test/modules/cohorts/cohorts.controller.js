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
exports.CohortsController = void 0;
const common_1 = require("@nestjs/common");
const invite_code_service_1 = require("./invite-code.service");
const create_invite_code_dto_1 = require("./dto/create-invite-code.dto");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const kysely_1 = require("kysely");
const common_2 = require("@nestjs/common");
let CohortsController = class CohortsController {
    inviteCodeService;
    db;
    constructor(inviteCodeService, db) {
        this.inviteCodeService = inviteCodeService;
        this.db = db;
    }
    async createInviteCode(cohortId, dto, req) {
        const user = req.user || { id: 'mock-user-id', role: user_role_enum_1.UserRole.RANGER };
        if (user.role !== user_role_enum_1.UserRole.ADMIN) {
            const cohort = await this.db
                .selectFrom('cohorts')
                .select('assignedRangerId')
                .where('id', '=', cohortId)
                .executeTakeFirst();
            if (!cohort || cohort.assignedRangerId !== user.id) {
                throw new common_1.ForbiddenException('You are not authorized to generate invite codes for this cohort');
            }
        }
        return this.inviteCodeService.generateInviteCode(cohortId, user.id, dto);
    }
};
exports.CohortsController = CohortsController;
__decorate([
    (0, common_1.Post)(':id/invite-codes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_invite_code_dto_1.CreateInviteCodeDto, Object]),
    __metadata("design:returntype", Promise)
], CohortsController.prototype, "createInviteCode", null);
exports.CohortsController = CohortsController = __decorate([
    (0, common_1.Controller)('cohorts'),
    __param(1, (0, common_2.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [invite_code_service_1.InviteCodeService,
        kysely_1.Kysely])
], CohortsController);
//# sourceMappingURL=cohorts.controller.js.map