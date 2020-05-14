import ModuleUtilities from "~/ModuleUtilities";
import {Module, GetterTree, MutationTree} from "vuex";
import Config from "~/Config";

interface S { [x: string]: any }
interface R { [x: string]: any }

describe('store/ModuleUtilities/ModuleUtilities.ts', () => {
    let utilities: ModuleUtilities<R>;
    const test_filled_module = {
        namespaced: false,
        state() {return { key: 'value' }},
        getters: {
            key: (state: S): any => {
                return state.name
            }
        } as GetterTree<S, R>,
        mutations: {
            key: (state: S, value: string): void => {
                state.name = value
            }
        } as MutationTree<S>,
        actions: { key: 'value' },
        modules: { key: 'value' }
    };

    beforeEach(() => {
        utilities = new ModuleUtilities();
    });

    test('The utilities can be instantiated', () => {
        expect( () => { new ModuleUtilities }).not.toThrow();
    });

    test('The utilities has a module property of type object', () => {
        expect(typeof utilities.module).toEqual('object');
    });

    test('The utilities has a namespaced property of type boolean', () => {
        expect(typeof utilities.namespaced).toEqual('boolean');
    });

    test('The utilities has a state property that returns an object.', () => {
        expect(typeof utilities.state).toEqual('object');
    });

    test('The utilities has a getters property that returns an object.', () => {
        expect(typeof utilities.getters).toEqual('object');
    });

    test('The utilities has a mutations property that returns an object.', () => {
        expect(typeof utilities.mutations).toEqual('object');
    });

    test('The utilities has a actions property that returns an object.', () => {
        expect(typeof utilities.actions).toEqual('object');
    });

    test('The utilities has a modules property that returns an object.', () => {
        expect(typeof utilities.modules).toEqual('object');
    });

    test('Resetting the utilities keeps the value of namespaced property', () => {
        const test_obj = {name: 'First Name'};
        const test_utilities = new ModuleUtilities({namespaced: false});

        test_utilities.state = test_obj;
        expect(test_utilities.module.namespaced).toEqual(false);
        expect(test_utilities.module.state()).toEqual(test_obj);

        test_utilities.reset();
        expect(test_utilities.module.namespaced).toEqual(false);
        expect(test_utilities.module.state()).toEqual({});
    });

    test('The state can be reset', () => {
        utilities.module = test_filled_module;
        utilities.resetState();
        expect(utilities.module.state()).toEqual({});
        expect(utilities.module.getters).toEqual(test_filled_module.getters);
        expect(utilities.module.mutations).toEqual(test_filled_module.mutations);
        expect(utilities.module.actions).toEqual(test_filled_module.actions);
        expect(utilities.module.modules).toEqual(test_filled_module.modules);
    });

    test('The getters can be reset', () => {
        utilities.module = test_filled_module;
        utilities.resetGetters();
        expect(utilities.module.state()).toEqual(test_filled_module.state);
        expect(utilities.module.getters).toEqual({});
        expect(utilities.module.mutations).toEqual(test_filled_module.mutations);
        expect(utilities.module.actions).toEqual(test_filled_module.actions);
        expect(utilities.module.modules).toEqual(test_filled_module.modules);
    });

    test('The mutations can be reset', () => {
        utilities.module = test_filled_module;
        utilities.resetMutations();
        expect(utilities.module.state()).toEqual(test_filled_module.state);
        expect(utilities.module.getters).toEqual(test_filled_module.getters);
        expect(utilities.module.mutations).toEqual({});
        expect(utilities.module.actions).toEqual(test_filled_module.actions);
        expect(utilities.module.modules).toEqual(test_filled_module.modules);
    });

    test('The actions can be reset', () => {
        utilities.module = test_filled_module;
        utilities.resetActions();
        expect(utilities.module.state()).toEqual(test_filled_module.state);
        expect(utilities.module.getters).toEqual(test_filled_module.getters);
        expect(utilities.module.mutations).toEqual(test_filled_module.mutations);
        expect(utilities.module.actions).toEqual({});
        expect(utilities.module.modules).toEqual(test_filled_module.modules);
    });

    test('The modules can be reset', () => {
        utilities.module = test_filled_module;
        utilities.resetModules();
        expect(utilities.module.state()).toEqual(test_filled_module.state);
        expect(utilities.module.getters).toEqual(test_filled_module.getters);
        expect(utilities.module.mutations).toEqual(test_filled_module.mutations);
        expect(utilities.module.actions).toEqual(test_filled_module.actions);
        expect(utilities.module.modules).toEqual({});
    });

    test('State properties can be added and removed', () => {
        const test_object = {key: 'last_name', value: 'Example'};
        // Add
        utilities.addState(test_object.key, test_object.value);
        expect(utilities.state[test_object.key]).toEqual(test_object.value);
        // Remove
        utilities.removeState(test_object.key);
        expect(utilities.state[test_object.key]).toBeUndefined();
    });

    test('Getters can be added and removed', () => {
        const test_object = {
            key: 'getLastName',
            value: (state: {[x: string]: any}) => {
                return state.last_name
            }
        };
        // Add
        utilities.addGetter(test_object.key, test_object.value);
        expect(utilities.getters[test_object.key]).toEqual(test_object.value);
        // Remove
        utilities.removeGetter(test_object.key);
        expect(utilities.getters[test_object.key]).toBeUndefined();
    });

    test('Mutations can be added and removed', () => {
        const test_object = {
            key: 'setLastName',
            value: (state: {[x: string]: any}, value: string) => {
                return state.last_name = value.toUpperCase()
            }
        };
        // Add
        utilities.addMutation(test_object.key, test_object.value);
        expect(utilities.mutations[test_object.key]).toEqual(test_object.value);
        // Remove
        utilities.removeMutation(test_object.key);
        expect(utilities.mutations[test_object.key]).toBeUndefined();
    });

    test('Actions can be added and removed', () => {
        const test_object = {
            key: 'setLastName',
            value: (context: {[x: string]: any}): void => {
                return context.commit('setLastName')
            }
        };
        // Add
        utilities.addAction(test_object.key, test_object.value);
        expect(utilities.actions[test_object.key]).toEqual(test_object.value);
        // Remove
        utilities.removeAction(test_object.key);
        expect(utilities.actions[test_object.key]).toBeUndefined();
    });

    test('Modules can be added and removed', () => {
        const test_object: Module<S, R> = {
            namespaced: true
        };
        // Add
        utilities.addModule('test_object', test_object);
        expect(utilities.modules['test_object']).toEqual(test_object);
        // Remove
        utilities.removeModule('test_object');
        expect(utilities.modules['test_object']).toBeUndefined();
    });

    test('THe config property is generated by the Config class', () => {
        const utilities = new ModuleUtilities();
        const config = new Config();
        expect(JSON.stringify(utilities.config)).toEqual(JSON.stringify(config.configure()));
    });
});
