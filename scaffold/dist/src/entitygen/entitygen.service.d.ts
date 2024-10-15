import { OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Data } from './data.dto';
import { PathsService } from './paths/paths.service';
export declare class EntitygenService implements OnModuleInit {
    private pathsService;
    private dataSource;
    private logger;
    private content;
    private firstTableName;
    private data;
    private entityArr;
    constructor(pathsService: PathsService, dataSource: DataSource);
    onModuleInit(): void;
    private isAllowedRelationshipCreating;
    setChangedDataToNull(): void;
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
