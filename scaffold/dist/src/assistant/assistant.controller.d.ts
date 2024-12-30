import { AssistantService } from "./assistant.service";
export declare class AssistantController {
    private readonly assistantService;
    constructor(assistantService: AssistantService);
    getLogFile(): any;
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
