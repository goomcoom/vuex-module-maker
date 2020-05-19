import * as D from "../types";
import { toCamelCase, toSnakeCase } from "./helpers";


class Config {
    readonly _default_getter = (state_name: string, default_value: any) => {
        return (state: any) => {
            // @ts-ignore
            return (state[state_name] == null) ? default_value : state[state_name];
        };
    };
    get default_getter() { return this._default_getter; };

    readonly _default_mutation = (state_name: string) => {
        return (state: any, value?: any) => {
            // @ts-ignore
            state[state_name] = (value == null) ? null : value;
        };
    };
    get default_mutation() { return this._default_mutation; };

    readonly _number_mutation = (state_name: string) => {
        return (state: any, value?: number|string) => {
            if (value == null) {
                // @ts-ignore
                state[state_name] = null;
            } else if (typeof value === 'number') {
                // @ts-ignore
                state[state_name] = value;
            } else {
                const num = parseInt(value);
                // @ts-ignore
                state[state_name] = isNaN(num) ? null : num;
            }
        };
    };
    get number_mutation() { return this._number_mutation; };

    readonly _boolean_mutation = (state_name: string) => {
        return (state: any, value?: any) => {
                // @ts-ignore
                state[state_name] = !!value;
        };
    };
    get boolean_mutation() { return this._boolean_mutation; };

    readonly _date_mutation = (state_name: string) => {
        return (state: any, value?: Date|string|number) => {
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

    readonly _object_mutation = (state_name: string) => {
        return (state: any, value?: object|string) => {
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

    readonly _custom_config: D.CustomConfig;
    get custom_config() { return this._custom_config; };

    private _config: D.Config = {
        namespaced: true,
        naming: {
            state: {
                prefix: '',
                suffix: '',
                transformer: toSnakeCase
            },
            getter: {
                prefix: 'get_',
                suffix: '',
                transformer: toCamelCase
            },
            mutation: {
                prefix: 'set_',
                suffix: '',
                transformer: toCamelCase
            },
        },
        types: {
            default: {
                initial_value: null,
                default_value: null,
                getter: this.default_getter,
                mutation: this.default_mutation,
            },
            string: {
                initial_value: null,
                default_value: '',
            },
            boolean: {
                initial_value: false,
                default_value: false,
                mutation: this.boolean_mutation,
            },
            number: {
                initial_value: null,
                default_value: null,
                mutation: this.number_mutation,
            },
            date: {
                initial_value: null,
                default_value: null,
                mutation: this.date_mutation,
            },
            array: {
                initial_value: null,
                default_value: [],
            },
            object: {
                initial_value: null,
                default_value: null,
                mutation: this.object_mutation
            },
        },
    };
    get config() { return this._config; };

    constructor(custom: D.CustomConfig = {}) {
        this._custom_config = custom;
    }

    public configure():D.Config {
        this.configureNamespaced();
        this.configureNaming();
        this.configureTypes();
        return this.config;
    }

    private configureNamespaced(): void {
        if (this.custom_config.namespaced !== undefined) {
            this.config.namespaced = this.custom_config.namespaced
        }
    }

    private configureNaming(): void {
        if (this.custom_config.naming === undefined) return;
        const custom = this.custom_config.naming;

        ['state','getter','mutation'].forEach((o) => {
            // @ts-ignore
            if (custom[o] !== undefined) {
                // @ts-ignore
                if (custom[o].prefix !== undefined) this.config.naming[o].prefix = custom[o].prefix;
                // @ts-ignore
                if (custom[o].suffix !== undefined) this.config.naming[o].suffix = custom[o].suffix;
                // @ts-ignore
                if (custom[o].transformer !== undefined) this.config.naming[o].transformer = custom[o].transformer;
            }
        });
    }

    private configureTypes(): void {
        if (this.custom_config.types) {
            let type: string;
            let options: D.ConfigTypeOptions;
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
