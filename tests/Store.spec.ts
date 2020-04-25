import Vue from "vue";
import { Instructions, Template } from "../types/index";
import ModuleGenerator from "~/ModuleGenerator";
import Vuex, {ActionTree, GetterTree, MutationTree, Store} from "vuex";

Vue.use(Vuex);
interface S { [x: string]: any }
interface R { [x: string]: any }

describe('Store Module Acceptance Tests', () => {
    let generator;
    let module;
    let store: Store<S>;
    const instructions: Instructions<S, R> = {
        id: {
            type: 'number'
        },
        example: {
            type: 'string',
            initial_value: 'Example text'
        },
        comments: {
            type: 'array'
        }
    };

    const template: Template<S, R> = {
        instructions,
        state: {
            name: null
        },
        getters: {
            getName: (state: S) => state.name
        } as GetterTree<S, R>,
        mutations: {
            setName: (state: S, value: string|null = null): void => {
                state.name = value
            }
        } as MutationTree<S>,
        actions: {
            updateUser: (context) => {
                context.commit('setName', 'Example Name');
            }
        } as ActionTree<S, R>,
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
        generator = new ModuleGenerator<S, R>();
        module = generator.generate(template);
        store = new Vuex.Store(module);
    });

    test('The store has the expected state', () => {
        expect(store.state).toEqual({
            id: null,
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