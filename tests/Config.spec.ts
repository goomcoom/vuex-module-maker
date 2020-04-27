import Config from "~/Config";

describe('Config.ts', () => {

    test('The config class can be instantiated', () => {
        expect(() => new Config()).not.toThrow();
    });

    test('The config class has a default property', () => {
        const config = new Config();
        expect(typeof config.default).toEqual('object');
    });
});