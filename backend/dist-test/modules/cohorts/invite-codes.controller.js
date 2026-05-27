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
exports.InviteCodesController = void 0;
const common_1 = require("@nestjs/common");
const invite_code_service_1 = require("./invite-code.service");
const validate_invite_code_dto_1 = require("./dto/validate-invite-code.dto");
const join_cohort_dto_1 = require("./dto/join-cohort.dto");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
let InviteCodesController = class InviteCodesController {
    inviteCodeService;
    constructor(inviteCodeService) {
        this.inviteCodeService = inviteCodeService;
    }
    async validateInviteCode(dto) {
        return this.inviteCodeService.validateInviteCode(dto);
    }
    async joinCohort(dto, req) {
        const user = req.user || { id: 'mock-junior-id', role: user_role_enum_1.UserRole.JUNIOR_RANGER };
        if (user.role !== user_role_enum_1.UserRole.JUNIOR_RANGER) {
            throw new common_1.ForbiddenException('Only Junior Rangers can join cohorts using invite codes');
        }
        return this.inviteCodeService.joinCohort(user.id, dto);
    }
};
exports.InviteCodesController = InviteCodesController;
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_invite_code_dto_1.ValidateInviteCodeDto]),
    __metadata("design:returntype", Promise)
], InviteCodesController.prototype, "validateInviteCode", null);
__decorate([
    (0, common_1.Post)('join'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_cohort_dto_1.JoinCohortDto, Object]),
    __metadata("design:returntype", Promise)
], InviteCodesController.prototype, "joinCohort", null);
exports.InviteCodesController = InviteCodesController = __decorate([
    (0, common_1.Controller)('invite-codes'),
    __metadata("design:paramtypes", [invite_code_service_1.InviteCodeService])
], InviteCodesController);
//# sourceMappingURL=invite-codes.controller.js.map