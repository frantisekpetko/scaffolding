import { DataSource } from "typeorm";
import { PathsService } from "../entitygen/paths/paths.service";
import { EntitygenService } from "./../entitygen/entitygen.service";
export declare class AssistantService {
    private entitygenService;
    private pathsService;
    private dataSource;
    private logger;
    constructor(entitygenService: EntitygenService, pathsService: PathsService, dataSource: DataSource);
    createAllEntities(data: any): Promise<void>;
    getSrcFiles(): Promise<string[]>;
    recreateDatabaseSchema(): Promise<void>;
    persistDatabaseSchema(): Promise<void>;
    removeTables(): Promise<void>;
    removeData(): Promise<void>;
    getEntityMetadata(): Promise<{
        source: string;
        sourceKey: string;
        target: string;
        targetKey: string;
        relation: string;
    }[]>;
}
