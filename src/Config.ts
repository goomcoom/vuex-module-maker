import * as D from "../types";

class Config<S, R> {
    readonly _default_getter: D.ConfigGetter<S, R> = (state_name, default_value) => {
        return (state: S) => {
            // @ts-ignore
            return (state[state_name] == null) ? default_value : state[state_name];
        };
    };
    get default_getter() { return this._default_getter; };

    readonly _default_mutation: D.ConfigMutation<S> = (state_name) => {
        return (state: S, value?: any) => {
            // @ts-ignore
            state[state_name] = (value == null) ? null : value;
        };
    };
    get default_mutation() { return this._default_mutation; };

    readonly _date_mutation: D.ConfigMutation<S> = (state_name) => {
        return (state: S, value?: Date|string|number) => {
            if (value) {
                const date = new Date(value);
                // @ts-ignore
                state[state_name] = (date.toDateString() === 'Invalid Date') ? null : date;
            } else {
                // @ts-ignore
                state[state_name] = null;
            }
        };
    };
    get date_mutation() { return this._date_mutation; };

    readonly _object_mutation: D.ConfigMutation<S> = (state_name) => {
        return (state: S, value?: object|string) => {
            if (typeof value === 'object') {
                // @ts-ignore
                state[state_name] = value;
            } else if (typeof value === 'string') {
                try {
                    // @ts-ignore
                    state[state_name] = JSON.parse(value);
                } catch (e) {
                    // @ts-ignore
                    state[state_name] = null;
                }
            } else {
                // @ts-ignore
                state[state_name] = null;
            }
        };
    };
    get object_mutation() { return this._object_mutation; };

    readonly _custom_config: D.CustomConfig<S, R>;
    get custom_config() { return this._custom_config; };

    private _config: D.Config<S, R> = {
        namespaced: true,
        types: {
            default: {
                default_value: null,
                getter: this.default_getter,
                mutation: this.default_mutation
            },
            string: { default_value: '' },
            boolean: { default_value: false },
            date: { mutation: this.date_mutation },
            array: { default_value: [] },
            object: { mutation: this.object_mutation },
        },
    };
    get config() { return this._config; };

    constructor(custom: D.CustomConfig<S, R> = {}) {
        this._custom_config = custom;
    }

    public configure():D.Config<S, R> {
        this.configureNamespaced();
        this.configureTypes();
        return this.config;
    }

    private configureNamespaced(): void {
        if (this.custom_config.namespaced !== undefined) {
            this.config.namespaced = this.custom_config.namespaced
        }
    }

    private configureTypes(): void {
        if (this.custom_config.types) {
            let type: string;
            let options: D.ConfigTypeOptions<S, R>;
            for ([type, options] of Object.entries(this.custom_config.types)) {
                this.addType(type);

                if (options.default_value !== undefined) this.config.types[type].default_value = options.default_value;
                if (options.getter !== undefined) this.config.types[type].getter = options.getter;
                if (options.mutation !== undefined) this.config.types[type].mutation = options.mutation;
            }
        }
    }

    private addType(type: string): void {
        if (this.config.types[type] === undefined) {
            this.config.types[type] = {};
        }
    }
}

export default Config
