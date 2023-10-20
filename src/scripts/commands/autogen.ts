import { command, subcommands } from "cmd-ts";
import { AutogenConfigD2Repository } from "data/AutogenConfigD2Repository";
import { MigrateAutogenConfigUseCase } from "domain/usecases/SaveNewConfigUseCase";
import _ from "lodash";
import { getApiUrlOption, getD2Api } from "scripts/common";

export function getCommand() {
    const migrateConfig = command({
        name: "migrate-config",
        description: "migrate d2-auto-generated forms config",
        args: {
            url: getApiUrlOption(),
        },
        handler: async args => {
            const api = getD2Api(args.url);
            const autogenConfigRepository = new AutogenConfigD2Repository(api);
            new MigrateAutogenConfigUseCase(autogenConfigRepository).execute();
        },
    });

    return subcommands({
        name: "config",
        cmds: { "migrate-config": migrateConfig },
    });
}
