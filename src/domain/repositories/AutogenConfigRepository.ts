import { Async } from "domain/entities/Async";
import { AutogenConfig, DataSet } from "domain/entities/AutogenConfig";

export interface AutogenConfigRepository {
    getOldConfig(): Async<AutogenConfig>;
    getAllDataSets(dataSetCodes: string[]): Async<DataSet[]>;
    formatConfig(dataSet: Record<string, any>, config: AutogenConfig): Async<AutogenConfig>;
    saveNewConfig(dataSetCode: string, config: AutogenConfig): Async<void>;
}
