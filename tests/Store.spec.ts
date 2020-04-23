import ModuleGenerator from "~/ModuleGenerator";
import * as D from "~/declarations";
// @ts-ignore
import Vuex, {Store} from 'vuex';
// @ts-ignore
import Vue from 'vue';

Vue.use(Vuex);

describe('Store Module Acceptance Tests', () => {
    let generator;
    let module;
    let store: Store<unknown>;

    const template: D.Template = {
        instructions: {
            id: {
                type: 'number'
            },
            age: {
                type: "number",
                initial_value: 27
            }
        },
        state: {
            name: null
        },
        getters: {
            getName: state => state.name
        } as D.Getters,
        mutations: {
            setName: (state: D.Object, value: string|null = null): void => {
                state.name = value
            }
        } as D.Mutations,
        actions: {
            updateUser: (context) => {
                context.commit('setName', 'Example Name');
            }
        } as D.Actions,
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
        generator = new ModuleGenerator();
        module = generator.generate(template);
        store = new Vuex.Store(module);
    });

    test('The store has the expected state', () => {
        expect(store.state).toEqual({
            id: null,
            age: 27,
            name: null,
            user: {
                title: 'Mrs'
            }
        })
    })
});