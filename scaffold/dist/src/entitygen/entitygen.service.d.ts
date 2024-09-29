import { PathsService } from './paths/paths.service';
import { OnModuleInit } from '@nestjs/common';
import { Data } from './data.dto';
import { DataSource } from 'typeorm';
export declare class EntitygenService implements OnModuleInit {
    private pathsService;
    private dataSource;
    private logger;
    private content;
    private firstTableName;
    private entityArr;
    constructor(pathsService: PathsService, dataSource: DataSource);
    onModuleInit(): void;
    private isAllowedRelationshipCreating;
    getEntityDataForView(entityName: string): Promise<{
        data: Data;
    }>;
    createEntityFile(data: Data): Promise<{
        data: string;
    }>;
    _createEntityFile(data: Data): Promise<{
        data: string;
    }>;
    finishGeneratingEntityFile(): Promise<void>;
    getEntityData(): Promise<{
        entityName: string;
        filename: string;
        table: string;
    }[]>;
    deleteEntity(entityName: string): Promise<void>;
}
