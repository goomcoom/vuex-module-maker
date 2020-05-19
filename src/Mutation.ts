import * as D from "../types";

class Mutation<Ts> {
    readonly _config: D.Config;
    get config() { return this._config; };

    constructor(config: D.Config) {
        this._config = config
    }

    format <T extends Ts>(type: T, state_name: string): ()=>void
    {
        // @ts-ignore
        if (this.config.types[type] === undefined || this.config.types[type].mutation === undefined) {
            return this.config.types.default.mutation(state_name);
        }
        // @ts-ignore
        return this.config.types[type].mutation(state_name);
    }
}

export default Mutation
