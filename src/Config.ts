import * as D from "../types";

class Config<S, R> {
    readonly _default_getter: D.ConfigGetter<S, R> = (state_name, default_value) => {
        return (state: S) => {
            // @ts-ignore
            return (state[state_name] == null) ? default_value : state[state_name];
        };
    };
    get default_getter() { return this._default_getter; };

    readonly _default_mutation: D.ConfigMutation<S, R> = (state_name) => {
        return (state: S, value?: any) => {
            // @ts-ignore
            state[state_name] = (value == null) ? null : value;
        };
    };
    get default_mutation() { return this._default_mutation; };

    readonly _default: D.DefaultConfig<S, R> = {
        namespaced: true,
        types: {
            default: {
                default_value: null,
                getter: this.default_getter,
                mutation: this.default_mutation
            },
            string: { default_value: '' },
            number: { default_value: null },
            boolean: { default_value: false },
            array: { default_value: [] },
            object: { default_value: null },
        }
    };
    get default() { return this._default };

    readonly _custom_config: D.CustomConfig<S, R>;
    get custom_config() { return this._custom_config; };

    private _config: D.Config<S, R> = this._default as any as D.Config<S, R>;
    get config() { return this._config; };
    set config(value) { this._config = value; };

    constructor(custom: D.CustomConfig<S, R> = {}) {
        this._custom_config = custom;
    }

}

export default Config
