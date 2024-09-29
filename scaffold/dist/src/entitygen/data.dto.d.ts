export declare class Column {
    nameOfColumn: string;
    datatype: string;
    notNull: boolean;
    unique: boolean;
    index: boolean;
}
export declare class Relationship {
    type: string;
    table: string;
}
export declare class Data {
    name: string;
    columns: Column[];
    relationships: Relationship[];
    originalEntityName?: string;
    isEditedEntity?: boolean;
}
