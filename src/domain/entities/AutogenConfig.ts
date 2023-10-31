interface CodedRef {
    code: string;
}

interface AutogenConfigSchema {
    dataSets: Record<string, any>;
    dataElements: Record<string, any>;
    categoryCombinations: Record<string, any>;
}

export type AutogenConfig = AutogenConfigSchema[keyof AutogenConfigSchema];

export interface DataSet extends CodedRef {
    dataSetElements: {
        categoryCombo?: CodedRef;
        dataElement: CodedRef;
    }[];
}
