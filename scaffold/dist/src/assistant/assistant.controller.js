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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantController = void 0;
const common_1 = require("@nestjs/common");
const assistant_service_1 = require("./assistant.service");
let AssistantController = class AssistantController {
    constructor(assistantService) {
        this.assistantService = assistantService;
    }
    recreateDatabaseSchema() {
        return this.assistantService.recreateDatabaseSchema();
    }
    persistDatabaseSchema() {
        return this.assistantService.persistDatabaseSchema();
    }
    removeTables() {
        return this.assistantService.removeTables();
    }
    removeData() {
        return this.assistantService.removeData();
    }
    getEntityMetadata() {
        return this.assistantService.getEntityMetadata();
    }
};
__decorate([
    (0, common_1.Post)('schema/recreate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssistantController.prototype, "recreateDatabaseSchema", null);
__decorate([
    (0, common_1.Post)('schema/persist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssistantController.prototype, "persistDatabaseSchema", null);
__decorate([
    (0, common_1.Post)('tables'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssistantController.prototype, "removeTables", null);
__decorate([
    (0, common_1.Post)('data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssistantController.prototype, "removeData", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssistantController.prototype, "getEntityMetadata", null);
AssistantController = __decorate([
    (0, common_1.Controller)('assistant'),
    __metadata("design:paramtypes", [assistant_service_1.AssistantService])
], AssistantController);
exports.AssistantController = AssistantController;
//# sourceMappingURL=assistant.controller.js.map