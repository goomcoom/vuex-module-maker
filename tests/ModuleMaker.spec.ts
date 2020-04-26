import ModuleMaker from "../src/ModuleMaker";
import {Instruction, Instructions, Template} from "../types";

interface S {
    example: any;
    executed: boolean;
    number: number | null,
    name: string | null
}
interface R { [x: string]: any }

describe('src/ModuleGenerator.ts', () => {

    test('The namespaced property can be controlled', () => {
        let generator = new ModuleMaker<S, R>();
        expect(generator.namespaced).toBe(true);

        const config = {
            namespaced: false
        };
        generator = new ModuleMaker(config);
        expect(generator.namespaced).toBe(false);
    });

    test('Passing an empty raw module returns an empty module', () => {
        const generator = new ModuleMaker<S, R>();
        const module  = JSON.stringify(generator.module);
        expect(JSON.stringify(generator.make({}))).toEqual(module);
    });

    test('Passing instructions sets the state if set_state != false', () => {
        const template: Template<S, R> = {
            instructions: {
                id: {
                    type: 'number'
                } as Instruction<'number', S, R>,
                name: {
                    type: 'string',
                    set_state: true,
                    initial_value: '6543'
                } as Instruction<'string', S, R>,
                comments: {
                    type: 'array',
                    set_state: false
                } as Instruction<'array', S, R>
            } as Instructions<S, R>
        };

        const generator = new ModuleMaker<S, R>();
        // @ts-ignore
        const state = generator.make(template).state();

        expect(state.hasOwnProperty('id')).toBe(true);
        expect(state.hasOwnProperty('name')).toBe(true);
        expect(state.hasOwnProperty('comments')).toBe(false);
    });

    test('Passing instructions sets the getters if set_getter != false', () => {
        const template: Template<S, R> = {
            instructions: {
                id: { type: 'number' } as Instruction<'number', S, R>,
                name: { type: 'string', set_getter: true, initial_value: '3456' } as Instruction<'string', S, R>,
                comments: { type: 'array', set_getter: false } as Instruction<'array', S, R>
            } as Instructions<S, R>
        };

        const generator = new ModuleMaker<S, R>();
        const getters = generator.make(template).getters;

        if (getters) { // Interface dictates that getters may be undefined
            expect(getters.hasOwnProperty('getId')).toBe(true);
            expect(getters.hasOwnProperty('getName')).toBe(true);
            expect(getters.hasOwnProperty('getComments')).toBe(false);
        }
    });

    test('Passing instructions sets the mutations if set_mutation != false', () => {
        const template: Template<S, R> = {
            instructions: {
                id: {type: 'number'} as Instruction<'number', S, R>,
                name: {type: 'string', set_mutation: true} as Instruction<'string', S, R>,
                comments: {type: 'array', set_mutation: false} as Instruction<'array', S, R>
            } as Instructions<S, R>
        };

        const generator = new ModuleMaker<S, R>();
        const mutations = generator.make(template).mutations;

        if (mutations) { // Interface dictates that mutations may be undefined
            expect(mutations.hasOwnProperty('setId')).toBe(true);
            expect(mutations.hasOwnProperty('setName')).toBe(true);
            expect(mutations.hasOwnProperty('setComments')).toBe(false);
        }
    });

    test('Template state properties are added to the module and take precedence', () => {
        const template: Template<S, R> = {
            instructions: {
                executed: {
                    type: 'boolean',
                    initial_value: true
                }
            },
            state: {
                example: null,
                executed: false
            }
        };

        const generator = new ModuleMaker<S, R>();
        // @ts-ignore
        const state = generator.make(template).state();
        if (template.state) {
            expect(state.example).toEqual(template.state.example);
            expect(state.executed).toEqual(template.state.executed);
        }
    });

    test('Template getters are added to the module and take precedence', () => {
        const template: Template<S, R> = {
            instructions: {
                executed: {
                    type: 'boolean',
                }
            },
            getters: {
                getExample: (state: S): any => state.example,
                getExecuted: (state: S): boolean => state.executed
            }
        };

        const generator = new ModuleMaker<S, R>();
        const getters = generator.make(template).getters;

        // @ts-ignore
        expect(getters.getExample).toEqual(template.getters.getExample);
        // @ts-ignore
        expect(getters.getExecuted).toEqual(template.getters.getExecuted);
    });

    test('Template mutations are added to the module and take precedence', () => {
        const template: Template<S, R> = {
            instructions: {
                executed: {
                    type: 'boolean',
                }
            },
            mutations: {
                setExample: (state: S, value: any): void => {
                    state.example = value
                },
                setExecuted: (state: S): void => {
                    state.executed = !state.executed
                }
            }
        };

        const generator = new ModuleMaker<S, R>();
        const mutations = generator.make(template).mutations;
        // @ts-ignore
        expect(mutations.setExample).toEqual(template.mutations.setExample);
        // @ts-ignore
        expect(mutations.setExecuted).toEqual(template.mutations.setExecuted);
    });

    test('Actions are added to the module', () => {
        const template: Template<S, R> = {
            actions: {
                grow: (context): void => {
                    context.commit('setAge', 23);
                    context.commit('setExecuted');
                }
            }
        };

        const generator = new ModuleMaker<S, R>();
        const actions = generator.make(template).actions;
        // @ts-ignore
        expect(actions.grow).toEqual(template.actions.grow);
    });

    test('Sub modules are added to the module', () => {
        const template: Template<S, R> = {
            modules: {
                user: {
                    namespaced: true,
                    state() {return {}}
                }
            }
        };

        const generator = new ModuleMaker<S, R>();
        const modules = generator.make(template).modules;
        // @ts-ignore
        expect(modules.user).toEqual(template.modules.user);
    });
});
