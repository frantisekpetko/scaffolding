/// <reference types="node" />
import { Server, Socket } from "socket.io";
import { DataSource } from "typeorm";
import { EntitygenService } from "./entitygen.service";
import { PathsService } from "./paths/paths.service";
import { OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
export declare class EntitygenGateway implements OnGatewayInit, OnGatewayConnection, OnModuleInit, OnApplicationBootstrap {
    private entityGenService;
    private pathsService;
    private dataSource;
    private logger;
    wss: Server;
    timer: NodeJS.Timeout | string | number | undefined;
    constructor(entityGenService: EntitygenService, pathsService: PathsService, dataSource: DataSource);
    onModuleInit(): Promise<void>;
    onApplicationBootstrap(): Promise<void>;
    afterInit(server: Server): Promise<void>;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    sendDataWhenFilesHaveChanged(): Promise<void>;
    handleEntitiesMessage(client: Socket): Promise<void>;
    handleMessage(client: any, entity: string): Promise<void>;
    deleteEntity(client: any, entityName: string): Promise<void>;
}
