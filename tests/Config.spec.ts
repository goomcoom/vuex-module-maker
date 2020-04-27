import Config from "~/Config";
import * as D from "../types";

describe('Config.ts', () => {

    test('The config class can be instantiated', () => {
        expect(() => new Config()).not.toThrow();
    });

    test('The config class has a default property', () => {
        const config = new Config();
        expect(typeof config.default).toEqual('object');
    });

    test('The custom config can be accessed after instantiation', () => {
        const custom: D.CustomConfig<any, any> = { namespaced: true };
        const config = new Config(custom);
        expect(config.custom_config).toEqual(custom);
    });

    test('The Config class has a config property', () => {
        const config = new Config<any, any>();
        expect(typeof config.config).toEqual('object')
    });

    test('If no custom config is passed the config is equal to the default', () => {
        const config = new Config<any, any>();
        expect(config.config).toEqual(config.default)
    });
});