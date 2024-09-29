/// <reference types="node" />
import { EntitygenService } from './entitygen.service';
import { OnModuleInit, OnApplicationBootstrap } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PathsService } from './paths/paths.service';
import { DataSource } from 'typeorm';
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
