import Config from "~/Config";
import * as D from "../types";
import {toCamelCase, toSnakeCase} from "../src/helpers";

describe('Config.ts', () => {
    let example_custom_config: D.CustomConfig<any, any>;

    beforeEach(() => {
        example_custom_config = {
            types: {
                default: {
                    initial_value: 'banana',
                    default_value: 'default value',
                    getter: (state_name, default_value) => {
                        return (state: any): any => {
                            default_value = state[state_name] == null ? 'is null' : 'not null';
                            return default_value;
                        }
                    },
                    mutation: (state_name) => {
                        return (state: any, value: string): void => {
                            state[state_name] = value ? 'is NULL' : 'is not NULL';
                        }
                    }
                }
            }
        };
    });

    test('The config class can be instantiated', () => {
        expect(() => new Config()).not.toThrow();
    });

    test('The custom config can be accessed after instantiation', () => {
        const custom: D.CustomConfig<any, any> = { namespaced: true };
        const config = new Config(custom);
        expect(config.custom_config).toEqual(custom);
    });

    test('The Config class has a config property', () => {
        const config = new Config();
        expect(typeof config.config).toEqual('object')
    });

    test('The config class has a configure method that returns the config', () => {
        const config = new Config();
        expect(config.configure()).toEqual(config.config)
    });

    test('The custom config overrides the namespaced value', () => {
        let config = new Config();
        expect(config.configure().namespaced).toEqual(config.config.namespaced);

        const custom: D.CustomConfig<any, any> = { namespaced: false };
        config = new Config(custom);
        expect(config.configure().namespaced).toEqual(custom.namespaced);
    });

    test('Existing types can be overwritten', () => {
        const custom = example_custom_config;

        let config = new Config();
        // @ts-ignore
        expect(config.configure().types.default.default_value).not.toEqual(custom.types.default.default_value);
        // @ts-ignore
        expect(config.configure().types.default.getter).not.toEqual(custom.types.default.getter);
        // @ts-ignore
        expect(config.configure().types.default.mutation).not.toEqual(custom.types.default.mutation);

        config = new Config(custom);
        // @ts-ignore
        expect(config.configure().types.default.default_value).toEqual(custom.types.default.default_value);
        // @ts-ignore
        expect(config.configure().types.default.getter).toEqual(custom.types.default.getter);
        // @ts-ignore
        expect(config.configure().types.default.mutation).toEqual(custom.types.default.mutation);
    });

    test('New types can be added', () => {
        // Rename the example type from default to example
        const custom: D.CustomConfig<any, any> = {
            types: {
                // @ts-ignore
                example: example_custom_config.types.default
            }
        };

        let config = new Config();
        expect(config.configure().types.example).toBeUndefined();

        config = new Config(custom);
        // @ts-ignore
        expect(config.configure().types.example.default_value).toEqual(custom.types.example.default_value);
        // @ts-ignore
        expect(config.configure().types.example.getter).toEqual(custom.types.example.getter);
        // @ts-ignore
        expect(config.configure().types.example.mutation).toEqual(custom.types.example.mutation);
    });

    test('Types with no options are left empty.', () => {
        const custom: D.CustomConfig<any, any> = {
            types: {
                example: {}
            }
        };

        let config = new Config();
        expect(config.configure().types.example).toBeUndefined();

        config = new Config(custom);
        expect(config.configure().types.example).toEqual({});
    });

    test.each`
        option        | prefix    | test_prefix | suffix | test_suffix | transformer    | test_transformer
        ${'state'}    | ${''}     | ${'S_x'}    | ${''}  | ${'x_S'}    | ${toSnakeCase} | ${(x: string) => x.toUpperCase()}
        ${'getter'}   | ${'get_'} | ${'G_x'}    | ${''}  | ${'x_G'}    | ${toCamelCase} | ${(x: string) => x.toUpperCase()}
        ${'mutation'} | ${'set_'} | ${'M_x'}    | ${''}  | ${'x_M'}    | ${toCamelCase} | ${(x: string) => x.toUpperCase()}
    `('The $option naming config can be controlled', (vars) => {
        /* If an empty naming config is passed, the config should remain as is. */
        const custom = {naming: {}};
        let ConfigClass = new Config(custom);
        let config = ConfigClass.configure();
        // @ts-ignore
        expect(config.naming[vars.option].prefix).toEqual(vars.prefix);
        // @ts-ignore
        expect(config.naming[vars.option].suffix).toEqual(vars.suffix);
        // @ts-ignore
        expect(config.naming[vars.option].transformer).toEqual(vars.transformer);

        /* If the naming options are empty the config should still remain the same */
        custom.naming = {
            state: {},
            getter: {},
            mutation: {},
        }

        ConfigClass = new Config(custom);
        config = ConfigClass.configure();

        // @ts-ignore
        expect(config.naming[vars.option].prefix).toEqual(vars.prefix);
        // @ts-ignore
        expect(config.naming[vars.option].suffix).toEqual(vars.suffix);
        // @ts-ignore
        expect(config.naming[vars.option].transformer).toEqual(vars.transformer);


        /* The custom options should override the default */
        // @ts-ignore
        custom.naming[vars.option] = {
            prefix: vars.test_prefix,
            suffix: vars.test_suffix,
            transformer: vars.test_transformer,
        };

        ConfigClass = new Config(custom);
        config = ConfigClass.configure();
        // @ts-ignore
        expect(config.naming[vars.option].prefix).toEqual(custom.naming[vars.option].prefix);
        // @ts-ignore
        expect(config.naming[vars.option].suffix).toEqual(custom.naming[vars.option].suffix);
        // @ts-ignore
        expect(config.naming[vars.option].transformer).toEqual(custom.naming[vars.option].transformer);
    });
});