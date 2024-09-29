"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitygenModule = void 0;
const paths_service_1 = require("./paths/paths.service");
const entitygen_gateway_1 = require("./entitygen.gateway");
const common_1 = require("@nestjs/common");
const entitygen_controller_1 = require("./entitygen.controller");
const entitygen_service_1 = require("./entitygen.service");
const utils_service_1 = require("./utils/utils.service");
let EntitygenModule = class EntitygenModule {
};
EntitygenModule = __decorate([
    (0, common_1.Module)({
        controllers: [entitygen_controller_1.EntitygenController],
        providers: [entitygen_service_1.EntitygenService, entitygen_gateway_1.EntitygenGateway, paths_service_1.PathsService, utils_service_1.UtilsService],
        exports: [entitygen_service_1.EntitygenService, entitygen_gateway_1.EntitygenGateway],
    })
], EntitygenModule);
exports.EntitygenModule = EntitygenModule;
//# sourceMappingURL=entitygen.module.js.map