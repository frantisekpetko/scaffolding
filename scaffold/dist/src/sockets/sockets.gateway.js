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
var SocketsGateway_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketsGateway = void 0;
const entitygen_service_1 = require("./../entitygen/entitygen.service");
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let SocketsGateway = SocketsGateway_1 = class SocketsGateway {
    constructor(entityGenService) {
        this.entityGenService = entityGenService;
        this.logger = new common_1.Logger(SocketsGateway_1.name);
    }
    async onModuleInit() {
    }
    async onApplicationBootstrap() {
    }
    async afterInit(server) {
    }
    async handleConnection(client, ...args) {
    }
    async handleEntitiesMessage(client) {
    }
    async handleMessage(client, entity) {
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('entities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocketsGateway.prototype, "handleEntitiesMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocketsGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], SocketsGateway, "wss", void 0);
SocketsGateway = SocketsGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ namespace: '/generator' }),
    __metadata("design:paramtypes", [entitygen_service_1.EntitygenService])
], SocketsGateway);
exports.SocketsGateway = SocketsGateway;
//# sourceMappingURL=sockets.gateway.js.map