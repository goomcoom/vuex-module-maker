import ModuleMaker from "~/ModuleMaker";
import {DefaultTypes, Instruction, Instructions, Template} from "../types";

type S = { [x: string]: any }
type R = S

describe('src/ModuleGenerator.ts', () => {

    test('The namespaced property can be controlled', () => {
        let generator = new ModuleMaker<S, R, DefaultTypes>();
        expect(generator.namespaced).toBe(true);

        const config = {
            namespaced: false
        };
        generator = new ModuleMaker(config);
        expect(generator.namespaced).toBe(false);
    });

    test('Passing an empty raw module returns an empty module', () => {
        const generator = new ModuleMaker<S, R, DefaultTypes>();
        const module  = JSON.stringify(generator.module);
        expect(JSON.stringify(generator.make({}))).toEqual(module);
    });

    test('Passing instructions sets the state if set_state != false', () => {
        const template: Template<S, R, DefaultTypes> = {
            instructions: {
                id: {
                    type: 'number'
                } as Instruction<'number', S, R, DefaultTypes>,
                name: {
                    type: 'string',
                    set_state: true,
                    initial_value: '6543'
                } as Instruction<'string', S, R, DefaultTypes>,
                comments: {
                    type: 'array',
                    set_state: false
                } as Instruction<'array', S, R, DefaultTypes>
            } as Instructions<S, R, DefaultTypes>
        };

        const generator = new ModuleMaker<S, R, DefaultTypes>();
        // @ts-ignore
        const state = generator.make(template).state();

        expect(state.hasOwnProperty('id')).toBe(true);
        expect(state.hasOwnProperty('name')).toBe(true);
        expect(state.hasOwnProperty('comments')).toBe(false);
    });

    test('Passing instructions sets the getters if set_getter != false', () => {
        const template: Template<S, R, DefaultTypes> = {
            instructions: {
                id: { type: 'number' } as Instruction<'number', S, R, DefaultTypes>,
                name: { type: 'string', set_getter: true, initial_value: '3456' } as Instruction<'string', S, R, DefaultTypes>,
                comments: { type: 'array', set_getter: false } as Instruction<'array', S, R, DefaultTypes>
            } as Instructions<S, R, DefaultTypes>
        };

        const generator = new ModuleMaker<S, R, DefaultTypes>();
        const getters = generator.make(template).getters;

        if (getters) { // Interface dictates that getters may be undefined
            expect(getters.hasOwnProperty('getId')).toBe(true);
            expect(getters.hasOwnProperty('getName')).toBe(true);
            expect(getters.hasOwnProperty('getComments')).toBe(false);
        }
    });

    test('Passing instructions sets the mutations if set_mutation != false', () => {
        const template: Template<S, R, DefaultTypes> = {
            instructions: {
                id: {type: 'number'} as Instruction<'number', S, R, DefaultTypes>,
                name: {type: 'string', set_mutation: true} as Instruction<'string', S, R, DefaultTypes>,
                comments: {type: 'array', set_mutation: false} as Instruction<'array', S, R, DefaultTypes>
            } as Instructions<S, R, DefaultTypes>
        };

        const generator = new ModuleMaker<S, R, DefaultTypes>();
        const mutations = generator.make(template).mutations;

        if (mutations) { // Interface dictates that mutations may be undefined
            expect(mutations.hasOwnProperty('setId')).toBe(true);
            expect(mutations.hasOwnProperty('setName')).toBe(true);
            expect(mutations.hasOwnProperty('setComments')).toBe(false);
        }
    });

    test('Template state properties are added to the module and take precedence', () => {
        const template: Template<S, R, DefaultTypes> = {
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

        const generator = new ModuleMaker<S, R, DefaultTypes>();
        // @ts-ignore
        const state = generator.make(template).state();
        if (template.state) {
            // @ts-ignore
            expect(state.example).toEqual(template.state.example);
            // @ts-ignore
            expect(state.executed).toEqual(template.state.executed);
        }
    });

    test('Template getters are added to the module and take precedence', () => {
        const template: Template<S, R, DefaultTypes> = {
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

        const generator = new ModuleMaker<S, R, DefaultTypes>();
        const getters = generator.make(template).getters;

        // @ts-ignore
        expect(getters.getExample).toEqual(template.getters.getExample);
        // @ts-ignore
        expect(getters.getExecuted).toEqual(template.getters.getExecuted);
    });

    test('Template mutations are added to the module and take precedence', () => {
        const template: Template<S, R, DefaultTypes> = {
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

        const generator = new ModuleMaker<S, R, DefaultTypes>();
        const mutations = generator.make(template).mutations;
        // @ts-ignore
        expect(mutations.setExample).toEqual(template.mutations.setExample);
        // @ts-ignore
        expect(mutations.setExecuted).toEqual(template.mutations.setExecuted);
    });

    test('Actions are added to the module', () => {
        const template: Template<S, R, DefaultTypes> = {
            actions: {
                grow: (context): void => {
                    context.commit('setAge', 23);
                    context.commit('setExecuted');
                }
            }
        };

        const generator = new ModuleMaker<S, R, DefaultTypes>();
        const actions = generator.make(template).actions;
        // @ts-ignore
        expect(actions.grow).toEqual(template.actions.grow);
    });

    test('Sub modules are added to the module', () => {
        const template: Template<S, R, DefaultTypes> = {
            modules: {
                user: {
                    namespaced: true,
                    state() {return {}},
                    getters: {},
                    mutations: {},
                    actions: {},
                    modules: {},
                }
            }
        };

        const generator = new ModuleMaker<S, R, DefaultTypes>();
        const modules = generator.make(template).modules;
        // @ts-ignore
        expect(JSON.stringify(modules.user)).toEqual(JSON.stringify(template.modules.user));
    });

    test('The make methods creates a fresh module every time', () => {
        interface State { [x: string]: any }

        const Maker =  new ModuleMaker<State, State, DefaultTypes>();

        const first_template: Template<State, State, DefaultTypes> = {
            instructions: {
                id: 'number',
            },
        };

        const first_module = Maker.make(first_template);
        if (first_module.state) {
            // @ts-ignore
            expect(first_module.state()).toEqual({id: null});
        }

        const second_template: Template<State, State, DefaultTypes> = {
            instructions: {
                name: 'string',
            },
        };

        const second_module = Maker.make(second_template);
        if (second_module.state) {
            // @ts-ignore
            expect(second_module.state()).toEqual({name: null});
        }
    });

    test('The namespaced property can be controlled from the template', () => {
        interface State { [x: string]: any }

        const Maker =  new ModuleMaker<State, State, DefaultTypes>();

        const default_module = Maker.make({});
        expect(default_module.namespaced).toBe(true);

        const false_namespaced_template: Template<State, State, DefaultTypes> = {namespaced: false};
        const false_namespaced_module = Maker.make(false_namespaced_template);
        expect(false_namespaced_module.namespaced).toEqual(false);

        const true_namespaced_template: Template<State, State, DefaultTypes> = { namespaced: true };
        const true_namespaced_module = Maker.make(true_namespaced_template);
        expect(true_namespaced_module.namespaced).toEqual(true);
    });

    test('Template sub-modules are converted to modules', () => {
        interface State { [x: string]: any }

        const Maker =  new ModuleMaker<State, State, DefaultTypes>();

        const template: Template<State, State, DefaultTypes> = {
            modules: {
                user: {
                    instructions: {
                        name: 'string',
                    },
                    modules: {
                        profile: {
                            instructions: {
                                bio: "string",
                            },
                        },
                    },
                },
            },
        };

        const module = Maker.make(template);
        // @ts-ignore
        expect(module.modules.user.state().name).toEqual(null)
        // @ts-ignore
        expect(module.modules.user.modules.profile.state().bio).toEqual(null)
    });
});
