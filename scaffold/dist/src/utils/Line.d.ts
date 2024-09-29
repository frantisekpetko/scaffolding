export declare class TxtLine {
    private string;
    private value;
    constructor(string: any);
    object(): any[];
    remove(string_to_be_removed: any): this;
    removeAll(string_to_be_removed: any): this;
    fetch(line_number: any): any;
    edit(content: any, line_number: any): this;
    real_array(array: any): any[];
}
