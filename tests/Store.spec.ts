import Vue from "vue";
import {CustomConfig, DefaultTypes, Instructions, Template} from "../types";
import ModuleMaker from "~/ModuleMaker";
import Vuex, {Module, Mutation, Store} from "vuex";
// @ts-ignore
import Form from 'vform';

Vue.use(Vuex);

interface S { [x: string]: any }
type R = S
type Ts = DefaultTypes | 'form';
interface FormStore {
    login_form: Form|null
}

describe('Store Module Acceptance Tests', () => {
    let module;
    let store: Store<S>;
    const instructions: Instructions<Ts> = {
        id: 'number',
        example: {
            type: 'string',
            initial_value: 'Example text'
        },
        comments: 'array'
    };

    const template: Template<Ts> = {
        instructions,
        state: {
            name: null
        },
        getters: {
            getName: (state: S) => state.name
        },
        mutations: {
            setName: (state: S, value: string|null = null): void => {
                state.name = value
            }
        },
        actions: {
            updateUser: (context: any) => {
                context.commit('setName', 'Example Name');
            }
        },
        modules: {
            user: {
                namespaced: true,
                state(): Object {
                    return {
                        title: 'Mrs'
                    }
                }
            }
        }
    };

    beforeEach(() => {
        module = ModuleMaker.Make<S, Ts>(template);
        store = new Vuex.Store(module);
    });

    test('The store has the expected state', () => {
        expect(store.state).toEqual({
            id: null,
            // @ts-ignore
            example: instructions.example.initial_value,
            name: null,
            comments: null,
            user: {
                title: 'Mrs'
            }
        })
    });

    test('The getters return the correct values', () => {
        expect(store.getters.getComments).toEqual([]);
        expect(store.getters.getName).toEqual(null)
    });

    test('Mutations set the correct values', () => {
        const state = store.state as S;

        expect(state.id).toEqual(null);
        store.commit('setId', 43);
        expect(state.id).toEqual(43);

        expect(state.name).toEqual(null);
        store.commit('setName', 'New Name');
        expect(state.name).toEqual('New Name');
    });

    test('Actions perform as expected', () => {
        const state = store.state as S;

        expect(state.name).toEqual(null);
        store.dispatch('updateUser');
        expect(state.name).toEqual('Example Name');
    });
});

describe('Custom VForm type', () => {
    let store: Store<FormStore>;
    const config: CustomConfig = {
        types: {
            form: {
                default_value: new Form,
                mutation: (state_name: string): Mutation<S> => {
                    return (state: S, value?: object|Form): void => {
                        if (value == null) {
                            state[state_name] = null;
                        } else if (typeof value === 'object') {
                            state[state_name] = new Form(value);
                        } else {
                            state[state_name] = value;
                        }
                    }
                }
            }
        }
    };

    beforeEach(() => {
        const template: Template<Ts> = {
            instructions: {
                login_form: 'form'
            }
        };
        const module = ModuleMaker.Make<S, Ts>(template, config) as Module<S, R>;
        store = new Vuex.Store<FormStore>({
            modules: {
                form: module
            }
        });
    });

    test('The getter returns the correct value', () => {
        expect(store.getters['form/getLoginForm']).toEqual(new Form);
        // @ts-ignore
        store.state.form.login_form = new Form({email: 'example@email.com'});
        expect(store.getters['form/getLoginForm']).toEqual(new Form({email: 'example@email.com'}));
    });

    test('The mutation sets the correct value', () => {
        store.commit('form/setLoginForm', {email: 'example@email.com'});
        // @ts-ignore
        expect(store.state.form.login_form).toEqual(new Form({email: 'example@email.com'}));

        store.commit('form/setLoginForm', new Form({email: 'test@email.com'}));
        // @ts-ignore
        expect(store.state.form.login_form).toEqual(new Form({email: 'test@email.com'}));

        store.commit('form/setLoginForm');
        // @ts-ignore
        expect(store.state.form.login_form).toEqual(null);
    });
});