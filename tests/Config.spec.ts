import Config from "~/Config";
import * as D from "../types";

describe('Config.ts', () => {

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
        expect(config.configure().namespaced).toEqual(true);

        const custom: D.CustomConfig<any, any> = { namespaced: false };
        config = new Config(custom);
        expect(config.configure().namespaced).toEqual(false);
    });
});