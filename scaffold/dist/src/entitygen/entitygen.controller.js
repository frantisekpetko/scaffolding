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
var EntitygenController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitygenController = void 0;
const entitygen_service_1 = require("./entitygen.service");
const common_1 = require("@nestjs/common");
const data_dto_1 = require("./data.dto");
let EntitygenController = EntitygenController_1 = class EntitygenController {
    constructor(entityGenService) {
        this.entityGenService = entityGenService;
        this.logger = new common_1.Logger(EntitygenController_1.name);
        this.isAllowedRelationshipCreating = true;
    }
    async deleteEntity(entityName) {
        return this.entityGenService.deleteEntity(entityName);
    }
    async getEntityDataForView(entityName) {
        return this.entityGenService.getEntityDataForView(entityName);
    }
    async getEntityData() {
        const items = this.entityGenService.getEntityData();
        return items;
    }
    async createEntityFile(data) {
        this.logger.log('check data [createEntityFile] controller', data);
        const dataString = await this.entityGenService.createEntityFile(data);
        this.entityGenService.setChangedDataToNull();
        this.logger.log(dataString);
        return dataString;
    }
    async finishGeneratingEntityFile(data) {
        return this.entityGenService.finishGeneratingEntityFile();
    }
};
__decorate([
    (0, common_1.Delete)('/entity/:entityName'),
    __param(0, (0, common_1.Param)('entityName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntitygenController.prototype, "deleteEntity", null);
__decorate([
    (0, common_1.Get)('/entity/:entityName'),
    __param(0, (0, common_1.Param)('entityName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EntitygenController.prototype, "getEntityDataForView", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EntitygenController.prototype, "getEntityData", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_dto_1.Data]),
    __metadata("design:returntype", Promise)
], EntitygenController.prototype, "createEntityFile", null);
__decorate([
    (0, common_1.Post)('/finish'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_dto_1.Data]),
    __metadata("design:returntype", Promise)
], EntitygenController.prototype, "finishGeneratingEntityFile", null);
EntitygenController = EntitygenController_1 = __decorate([
    (0, common_1.Controller)('entitygen'),
    __metadata("design:paramtypes", [entitygen_service_1.EntitygenService])
], EntitygenController);
exports.EntitygenController = EntitygenController;
//# sourceMappingURL=entitygen.controller.js.map