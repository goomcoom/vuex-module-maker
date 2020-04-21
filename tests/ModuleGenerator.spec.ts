import ModuleGenerator from "~/ModuleGenerator";

describe('store/ModuleGenerator/ModuleGenerator.ts', () => {
    let generator: ModuleGenerator;
    const test_filled_module = {
        namespaced: false,
        state() {return { key: 'value' }},
        getters: { key: 'value' },
        mutations: { key: 'value' },
        actions: { key: 'value' },
        modules: { key: 'value' }
    };

    beforeEach(() => {
        generator = new ModuleGenerator();
    });

    test('The generator can be instantiated', () => {
        expect( () => { new ModuleGenerator }).not.toThrow();
    });

    test('The generator has a module property of type object', () => {
        expect(typeof generator.module).toEqual('object');
    });

    test('The generator has a namespaced property of type boolean', () => {
        expect(typeof generator.namespaced).toEqual('boolean');
    });

    test('The namespaced property is set to true by default but can be set to false on instantiation', () => {
        expect(generator.namespaced).toBe(true);
        const test_generator = new ModuleGenerator(false);
        expect(test_generator.namespaced).toBe(false);
    });

    test('The generator has a state property that returns an object.', () => {
        expect(typeof generator.state).toEqual('object');
    });

    test('The generator has a getters property that returns an object.', () => {
        expect(typeof generator.getters).toEqual('object');
    });

    test('The generator has a mutations property that returns an object.', () => {
        expect(typeof generator.mutations).toEqual('object');
    });

    test('The generator has a actions property that returns an object.', () => {
        expect(typeof generator.actions).toEqual('object');
    });

    test('The generator has a modules property that returns an object.', () => {
        expect(typeof generator.modules).toEqual('object');
    });

    test('Resetting the generator keeps the value of namespaced property', () => {
        const test_obj = {name: 'First Name'};
        const test_generator = new ModuleGenerator(false);

        test_generator.state = test_obj;
        expect(test_generator.module.namespaced).toEqual(false);
        expect(test_generator.module.state()).toEqual(test_obj);

        test_generator.reset();
        expect(test_generator.module.namespaced).toEqual(false);
        expect(test_generator.module.state()).toEqual({});
    });

    test('The state can be reset', () => {
        generator.module = test_filled_module;
        generator.resetState();
        expect(generator.module.state()).toEqual({});
        expect(generator.module.getters).toEqual(test_filled_module.getters);
        expect(generator.module.mutations).toEqual(test_filled_module.mutations);
        expect(generator.module.actions).toEqual(test_filled_module.actions);
        expect(generator.module.modules).toEqual(test_filled_module.modules);
    });

    test('The getters can be reset', () => {
        generator.module = test_filled_module;
        generator.resetGetters();
        expect(generator.module.state()).toEqual(test_filled_module.state);
        expect(generator.module.getters).toEqual({});
        expect(generator.module.mutations).toEqual(test_filled_module.mutations);
        expect(generator.module.actions).toEqual(test_filled_module.actions);
        expect(generator.module.modules).toEqual(test_filled_module.modules);
    });

    test('The mutations can be reset', () => {
        generator.module = test_filled_module;
        generator.resetMutations();
        expect(generator.module.state()).toEqual(test_filled_module.state);
        expect(generator.module.getters).toEqual(test_filled_module.getters);
        expect(generator.module.mutations).toEqual({});
        expect(generator.module.actions).toEqual(test_filled_module.actions);
        expect(generator.module.modules).toEqual(test_filled_module.modules);
    });

    test('The actions can be reset', () => {
        generator.module = test_filled_module;
        generator.resetActions();
        expect(generator.module.state()).toEqual(test_filled_module.state);
        expect(generator.module.getters).toEqual(test_filled_module.getters);
        expect(generator.module.mutations).toEqual(test_filled_module.mutations);
        expect(generator.module.actions).toEqual({});
        expect(generator.module.modules).toEqual(test_filled_module.modules);
    });

    test('The modules can be reset', () => {
        generator.module = test_filled_module;
        generator.resetModules();
        expect(generator.module.state()).toEqual(test_filled_module.state);
        expect(generator.module.getters).toEqual(test_filled_module.getters);
        expect(generator.module.mutations).toEqual(test_filled_module.mutations);
        expect(generator.module.actions).toEqual(test_filled_module.actions);
        expect(generator.module.modules).toEqual({});
    });

    test('State properties can be added and removed', () => {
        const test_object = {key: 'last_name', value: 'Example'};
        // Add
        generator.addState(test_object.key, test_object.value);
        expect(generator.state[test_object.key]).toEqual(test_object.value);
        // Remove
        generator.removeState(test_object.key);
        expect(generator.state[test_object.key]).toBeUndefined();
    });

    test('Getters can be added and removed', () => {
        const test_object = {
            key: 'getLastName',
            value: (state: {[x: string]: any}) => {
                return state.last_name
            }
        };
        // Add
        generator.addGetter(test_object.key, test_object.value);
        expect(generator.getters[test_object.key]).toEqual(test_object.value);
        // Remove
        generator.removeGetter(test_object.key);
        expect(generator.getters[test_object.key]).toBeUndefined();
    });

    test('Mutations can be added and removed', () => {
        const test_object = {
            key: 'setLastName',
            value: (state: {[x: string]: any}, value: string) => {
                return state.last_name = value.toUpperCase()
            }
        };
        // Add
        generator.addMutation(test_object.key, test_object.value);
        expect(generator.mutations[test_object.key]).toEqual(test_object.value);
        // Remove
        generator.removeMutation(test_object.key);
        expect(generator.mutations[test_object.key]).toBeUndefined();
    });

    test('Actions can be added and removed', () => {
        const test_object = {
            key: 'setLastName',
            value: (context: {[x: string]: any}): void => {
                return context.commit('setLastName')
            }
        };
        // Add
        generator.addAction(test_object.key, test_object.value);
        expect(generator.actions[test_object.key]).toEqual(test_object.value);
        // Remove
        generator.removeAction(test_object.key);
        expect(generator.actions[test_object.key]).toBeUndefined();
    });

    test('Modules can be added and removed', () => {
        const test_object = {
            key: 'setLastName',
            value: test_filled_module
        };
        // Add
        generator.addModule(test_object.key, test_object.value);
        expect(generator.modules[test_object.key]).toEqual(test_object.value);
        // Remove
        generator.removeModule(test_object.key);
        expect(generator.modules[test_object.key]).toBeUndefined();
    });
});
