"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CohortsModule = void 0;
const common_1 = require("@nestjs/common");
const cohorts_controller_1 = require("./cohorts.controller");
const invite_codes_controller_1 = require("./invite-codes.controller");
const cohorts_list_controller_1 = require("./cohorts-list.controller");
const invite_code_service_1 = require("./invite-code.service");
let CohortsModule = class CohortsModule {
};
exports.CohortsModule = CohortsModule;
exports.CohortsModule = CohortsModule = __decorate([
    (0, common_1.Module)({
        controllers: [cohorts_controller_1.CohortsController, invite_codes_controller_1.InviteCodesController, cohorts_list_controller_1.CohortsListController],
        providers: [invite_code_service_1.InviteCodeService],
        exports: [invite_code_service_1.InviteCodeService],
    })
], CohortsModule);
//# sourceMappingURL=cohorts.module.js.map