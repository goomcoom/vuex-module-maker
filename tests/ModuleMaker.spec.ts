import ModuleMaker from "~/ModuleMaker";
import {DefaultTypes, Template} from "../types";

type S = { [x: string]: any }

describe('src/ModuleGenerator.ts', () => {

    test('The namespaced property can be controlled', () => {
        let generator = ModuleMaker.Make<S, DefaultTypes>({});
        expect(generator.namespaced).toBe(true);

        const config = {
            namespaced: false
        };
        generator = new ModuleMaker(config);
        expect(generator.namespaced).toBe(false);
    });

    test('Passing an empty raw module returns an empty module', () => {
        const module = ModuleMaker.Make<S, DefaultTypes>({});
        expect(JSON.stringify(module)).toEqual(JSON.stringify({
            namespaced: true,
            state() {
                return {}
            },
            getters: {},
            mutations: {},
            actions: {},
            modules: {},
        }));
    });

    test('Passing instructions sets the state if set_state != false', () => {
        const template: Template<DefaultTypes> = {
            instructions: {
                id: {
                    type: 'number'
                },
                name: {
                    type: 'string',
                    set_state: true,
                    initial_value: '6543'
                },
                comments: {
                    type: 'array',
                    set_state: false
                },
            },
        };

        const module = ModuleMaker.Make<S, DefaultTypes>(template);
        // @ts-ignore
        const state = module.state();

        expect(state.hasOwnProperty('id')).toBe(true);
        expect(state.hasOwnProperty('name')).toBe(true);
        expect(state.hasOwnProperty('comments')).toBe(false);
    });

    test('Passing instructions sets the getters if set_getter != false', () => {
        const template: Template<DefaultTypes> = {
            instructions: {
                id: { type: 'number' },
                name: { type: 'string', set_getter: true, initial_value: '3456' },
                comments: { type: 'array', set_getter: false },
            },
        };

        const module = ModuleMaker.Make<S, DefaultTypes>(template);
        const getters = module.getters;

        if (getters) { // Interface dictates that getters may be undefined
            expect(getters.hasOwnProperty('getId')).toBe(true);
            expect(getters.hasOwnProperty('getName')).toBe(true);
            expect(getters.hasOwnProperty('getComments')).toBe(false);
        }
    });

    test('Passing instructions sets the mutations if set_mutation != false', () => {
        const template: Template<DefaultTypes> = {
            instructions: {
                id: {type: 'number'},
                name: {type: 'string', set_mutation: true},
                comments: {type: 'array', set_mutation: false},
            },
        };

        const module = ModuleMaker.Make<S, DefaultTypes>(template);
        const mutations = module.mutations;

        if (mutations) { // Interface dictates that mutations may be undefined
            expect(mutations.hasOwnProperty('setId')).toBe(true);
            expect(mutations.hasOwnProperty('setName')).toBe(true);
            expect(mutations.hasOwnProperty('setComments')).toBe(false);
        }
    });

    test('Template state properties are added to the module and take precedence', () => {
        const template: Template<DefaultTypes> = {
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

        const module = ModuleMaker.Make<S, DefaultTypes>(template);
        // @ts-ignore
        const state = module.state();
        if (template.state) {
            // @ts-ignore
            expect(state.example).toEqual(template.state.example);
            // @ts-ignore
            expect(state.executed).toEqual(template.state.executed);
        }
    });

    test('Template getters are added to the module and take precedence', () => {
        const template: Template<DefaultTypes> = {
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

        const module = ModuleMaker.Make<S, DefaultTypes>(template);
        const getters = module.getters;

        // @ts-ignore
        expect(getters.getExample).toEqual(template.getters.getExample);
        // @ts-ignore
        expect(getters.getExecuted).toEqual(template.getters.getExecuted);
    });

    test('Template mutations are added to the module and take precedence', () => {
        const template: Template<DefaultTypes> = {
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

        const module = ModuleMaker.Make<S, DefaultTypes>(template);
        const mutations = module.mutations;
        // @ts-ignore
        expect(mutations.setExample).toEqual(template.mutations.setExample);
        // @ts-ignore
        expect(mutations.setExecuted).toEqual(template.mutations.setExecuted);
    });

    test('Actions are added to the module', () => {
        const template: Template<DefaultTypes> = {
            actions: {
                grow: (context: S): void => {
                    context.commit('setAge', 23);
                    context.commit('setExecuted');
                }
            }
        };

        const module = ModuleMaker.Make<S, DefaultTypes>(template);
        const actions = module.actions;
        // @ts-ignore
        expect(actions.grow).toEqual(template.actions.grow);
    });

    test('Sub modules are added to the module', () => {
        const template: Template<DefaultTypes> = {
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

        const module = ModuleMaker.Make<S, DefaultTypes>(template);
        const modules = module.modules;
        // @ts-ignore
        expect(JSON.stringify(modules.user)).toEqual(JSON.stringify(template.modules.user));
    });

    test('The make methods creates a fresh module every time', () => {
        const first_template: Template<DefaultTypes> = {
            instructions: {
                id: 'number',
            },
        };
        const first_module = ModuleMaker.Make<S, DefaultTypes>(first_template);
        // @ts-ignore
        expect(first_module.state()).toEqual({id: null});

        const second_template: Template<DefaultTypes> = {
            instructions: {
                name: 'string',
            },
        };
        const second_module = ModuleMaker.Make<S, DefaultTypes>(second_template);
        // @ts-ignore
        expect(first_module.state()).toEqual({id: null});
        // @ts-ignore
        expect(second_module.state()).toEqual({name: null});
    });

    test('The namespaced property can be controlled from the template', () => {
        interface S { [x: string]: any }

        const default_module = ModuleMaker.Make<S, DefaultTypes>({});
        expect(default_module.namespaced).toBe(true);

        const false_namespaced_template: Template<DefaultTypes> = {namespaced: false};
        const false_namespaced_module = ModuleMaker.Make<S, DefaultTypes>(false_namespaced_template);
        expect(false_namespaced_module.namespaced).toEqual(false);

        const true_namespaced_template: Template<DefaultTypes> = { namespaced: true };
        const true_namespaced_module = ModuleMaker.Make<S, DefaultTypes>(true_namespaced_template);
        expect(true_namespaced_module.namespaced).toEqual(true);
    });

    test('Template sub-modules are converted to modules', () => {
        const template: Template<DefaultTypes> = {
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

        const module = ModuleMaker.Make<S, DefaultTypes>(template);
        // @ts-ignore
        expect(module.modules.user.state().name).toEqual(null)
        // @ts-ignore
        expect(module.modules.user.modules.profile.state().bio).toEqual(null)
    });
});
