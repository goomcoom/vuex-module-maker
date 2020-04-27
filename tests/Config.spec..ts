import Config from "~/Config";

describe('Config.ts', () => {

    test('The config class can be instantiated', () => {
        expect(() => new Config()).not.toThrow();
    });
});