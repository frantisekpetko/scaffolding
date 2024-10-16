"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PathsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathsService = void 0;
const path = __importStar(require("path"));
const fs_1 = __importDefault(require("fs"));
const common_1 = require("@nestjs/common");
let PathsService = PathsService_1 = class PathsService {
    constructor() {
        this.logger = new common_1.Logger(PathsService_1.name);
    }
    getProcessProjectUrl() {
        let processProjectUrl = path.resolve(`${process.cwd()}/../${process.env.PROJECT_URL}`);
        this.logger.warn({ processProjectUrl }, fs_1.default.existsSync(processProjectUrl), 'xxx');
        if (fs_1.default.existsSync(processProjectUrl)) {
            return processProjectUrl;
        }
        else {
            console.warn('daadwwad');
            if (fs_1.default.existsSync('../../..')) {
                process.env.PROJECT_URL = '../../..';
                processProjectUrl = path.resolve(`${process.cwd()}/../${process.env.PROJECT_URL}`);
                return processProjectUrl;
            }
            else {
                throw new common_1.ServiceUnavailableException(`Project path ${processProjectUrl} doesn't exist. Please check PROJECT_URL property in your .env file. Othwerwise scaffold will may not work properly!`, {
                    cause: new Error(),
                    description: `Project path ${processProjectUrl} doesn't exist. Please check PROJECT_URL property in your .env file. Othwerwise scaffold will may not work properly!`,
                });
            }
        }
    }
    getRootUrl() {
        const processProjectUrl = path.resolve(`${process.cwd()}/../${process.env.PROJECT_URL}`);
        const root = `${processProjectUrl}/dist/src/server`;
        if (fs_1.default.existsSync(root)) {
            return root;
        }
        else {
            return null;
        }
    }
};
PathsService = PathsService_1 = __decorate([
    (0, common_1.Injectable)()
], PathsService);
exports.PathsService = PathsService;
//# sourceMappingURL=paths.service.js.map