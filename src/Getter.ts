import * as D from "../types";
import { Getter as VGetter } from "vuex";

class Getter<S, R, Ts> {
    readonly _config: D.Config<S, R>;
    get config() { return this._config; };

    constructor (config: D.Config<S, R>) {
        this._config = config;
    }

    format  <T extends D.Types<Ts>> (type: T, state_name: string, default_value: any = undefined): VGetter<S, R>
    {
        default_value = (default_value === undefined) ? this.getDefaultValue(type) : default_value;
        return this.prepareGetter(type, state_name, default_value);
    }

    getDefaultValue <T extends D.Types<Ts>>(type: T): any {
        // @ts-ignore
        if (this.config.types[type] === undefined) return this.config.types.default.default_value;
        // @ts-ignore
        if (this.config.types[type].default_value !== undefined) return this.config.types[type].default_value;
        return this.config.types.default.default_value;
    }

    prepareGetter <T extends D.Types<Ts>>(type: T, state_name: string, default_value: any): VGetter<S, R> {
        // @ts-ignore
        if (this.config.types[type] === undefined || this.config.types[type].getter === undefined) {
            return this.config.types.default.getter(state_name, default_value);
        }
        // @ts-ignore
        return this.config.types[type].getter(state_name, default_value);
    }
}

export default Getter
