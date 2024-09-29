import { EntitygenService } from './../entitygen/entitygen.service';
import { OnModuleInit, OnApplicationBootstrap } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
export declare class SocketsGateway implements OnGatewayInit, OnGatewayConnection, OnModuleInit, OnApplicationBootstrap {
    private entityGenService;
    private logger;
    static wss: Server;
    constructor(entityGenService: EntitygenService);
    onModuleInit(): Promise<void>;
    onApplicationBootstrap(): Promise<void>;
    afterInit(server: Server): Promise<void>;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleEntitiesMessage(client: any): Promise<void>;
    handleMessage(client: any, entity: string): Promise<void>;
}
