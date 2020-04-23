import * as D from '~/declarations';
import ModuleGenerator from "~/ModuleGenerator";

describe('src/ModuleGenerator.ts', () => {

    test('The namespaced property can be controlled', () => {
        let generator = new ModuleGenerator;
        expect(generator.namespaced).toBe(true);

        generator = new ModuleGenerator(false);
        expect(generator.namespaced).toBe(false);
    });

    test('Passing an empty raw module returns an empty module', () => {
        const generator = new ModuleGenerator;
        const module  = JSON.stringify(generator.module);
        expect(JSON.stringify(generator.generate({}))).toEqual(module);
    });

    test('Passing instructions sets the state if set_state != false', () => {
        const template: D.Template = {
            instructions: {
                id: {
                    type: 'number'
                } as D.Instruction<'number'>,
                name: {
                    type: 'string',
                    set_state: true,
                    initial_value: '6543'
                } as D.Instruction<'string'>,
                comments: {
                    type: 'array',
                    set_state: false
                } as D.Instruction<'array'>
            } as D.Instructions
        };

        const generator = new ModuleGenerator;
        const state = generator.generate(template).state();

        expect(state.hasOwnProperty('id')).toBe(true);
        expect(state.hasOwnProperty('name')).toBe(true);
        expect(state.hasOwnProperty('comments')).toBe(false);
    });

    test('Passing instructions sets the getters if set_getter != false', () => {
        const template: D.Template = {
            instructions: {
                id: { type: 'number' } as D.Instruction<'number'>,
                name: { type: 'string', set_getter: true, initial_value: '3456' } as D.Instruction<'string'>,
                comments: { type: 'array', set_getter: false } as D.Instruction<'array'>
            } as D.Instructions
        };

        const generator = new ModuleGenerator;
        const getters = generator.generate(template).getters;

        expect(getters.hasOwnProperty('getId')).toBe(true);
        expect(getters.hasOwnProperty('getName')).toBe(true);
        expect(getters.hasOwnProperty('getComments')).toBe(false);
    });

    test('Passing instructions sets the mutations if set_mutation != false', () => {
        const template: D.Template = {
            instructions: {
                id: {type: 'number'} as D.Instruction<'number'>,
                name: {type: 'string', set_mutation: true} as D.Instruction<'string'>,
                comments: {type: 'array', set_mutation: false} as D.Instruction<'array'>
            } as D.Instructions
        };

        const generator = new ModuleGenerator;
        const mutations = generator.generate(template).mutations;

        expect(mutations.hasOwnProperty('setId')).toBe(true);
        expect(mutations.hasOwnProperty('setName')).toBe(true);
        expect(mutations.hasOwnProperty('setComments')).toBe(false);
    });
});
