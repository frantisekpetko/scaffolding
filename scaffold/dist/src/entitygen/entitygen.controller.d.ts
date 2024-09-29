import { EntitygenService } from './entitygen.service';
import { Data } from './data.dto';
export declare class EntitygenController {
    private entityGenService;
    private logger;
    private isAllowedRelationshipCreating;
    constructor(entityGenService: EntitygenService);
    deleteEntity(entityName: string): Promise<void>;
    getEntityDataForView(entityName: any): Promise<any>;
    getEntityData(): Promise<{
        entityName: string;
        filename: string;
        table: string;
    }[]>;
    createEntityFile(data: Data): Promise<{
        data: string;
    }>;
    finishGeneratingEntityFile(data: Data): Promise<void>;
}
