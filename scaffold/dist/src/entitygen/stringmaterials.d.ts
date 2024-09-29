import { Column } from './data.dto';
interface Datatypes {
    [type: string]: (additionalProperties: string) => {
        column: string;
        type: string;
    };
}
export declare const datatypes: Datatypes;
export declare const relationshipString: (rel: string) => string;
export declare const columnString: (item: Column, datatypes: Datatypes, additionalProperties: string) => string;
export declare function getStringEntity(imports: string, model: string, Model: string, columns: string, relationships: string, entityImports: string): string;
export declare const getFromBetween: {
    results: any[];
    string: string;
    getFromBetween: (sub1: any, sub2: any) => any;
    removeFromBetween: (sub1: any, sub2: any) => boolean;
    getAllResults: (sub1: any, sub2: any) => void;
    get: (string: any, sub1: any, sub2: any) => any;
};
export {};
