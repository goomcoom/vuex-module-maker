import ModuleGenerator from "~/ModuleGenerator";

describe('src/ModuleGenerator.ts', () => {
    test('Passing an empty raw module returns an empty module', () => {
        const generator = new ModuleGenerator;
        const module  = JSON.stringify(generator.module);
        expect(JSON.stringify(generator.generate({}))).toEqual(module);
    });
});
