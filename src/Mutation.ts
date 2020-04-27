import * as D from "../types";
import { Mutation as VMutation } from "vuex";

class Mutation<S, R> {
    readonly _config: D.Config<S, R>;
    get config() { return this._config; };

    constructor(config: D.Config<S, R>) {
        this._config = config
    }

    format <T extends D.Types>(type: T, state_name: string): VMutation<S>
    {
        if (this.config.types[type] === undefined || this.config.types[type].mutation === undefined) {
            return this.config.types.default.mutation(state_name);
        }
        // @ts-ignore
        return this.config.types[type].mutation(state_name);
    }
}

export default Mutation
