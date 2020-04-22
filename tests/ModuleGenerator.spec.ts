import ModuleGenerator from "~/ModuleGenerator";

describe('src/ModuleGenerator.ts', () => {

    test('Passing an empty raw module returns an empty module', () => {
        const generator = new ModuleGenerator;
        const module  = JSON.stringify(generator.module);
        expect(JSON.stringify(generator.generate({}))).toEqual(module);
    });

    test('Passing instructions sets the state if set_state != false', () => {
        const test = {
            instruction: {
                id: {type: 'number'},
                name: {type: 'string', set_state: true},
                comments: {type: 'array', set_state: false}
            }
        };

        const generator = new ModuleGenerator;
        const state = generator.generate(test).state();

        expect(state.hasOwnProperty('id')).toBe(true);
        expect(state.hasOwnProperty('name')).toBe(true);
        expect(state.hasOwnProperty('comments')).toBe(false);
    });

    test('Passing instructions sets the getters if set_getter != false', () => {
        const test = {
            instruction: {
                id: {type: 'number'},
                name: {type: 'string', set_getter: true},
                comments: {type: 'array', set_getter: false}
            }
        };

        const generator = new ModuleGenerator;
        const getters = generator.generate(test).getters;

        expect(getters.hasOwnProperty('getId')).toBe(true);
        expect(getters.hasOwnProperty('getName')).toBe(true);
        expect(getters.hasOwnProperty('getComments')).toBe(false);
    });
});
