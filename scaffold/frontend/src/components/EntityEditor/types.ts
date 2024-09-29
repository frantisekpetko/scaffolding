export type Column = {
    nameOfColumn: string,
    datatype: string,
    notNull: boolean,
    unique: boolean,
    index: boolean,
}

export type FormState = {
    name: string,
    originalName: string,
    columns: Column[],
    relationships: {
        type: string,
        table: string
    }[]
}

export const emptyFormState = {
    name: '',
    originalName: '',
    columns: [{
        nameOfColumn: "",
        datatype: 'varchar',
        notNull: true,
        unique: false,
        index: false
    }],
    relationships: [{
        type: 'OneToOne',
        table: ''
    }]
};