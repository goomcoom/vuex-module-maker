import Mutation from "~/Mutation";

describe('store/ModuleGenerator/Mutation.ts', () => {
    test.each([['string'],['number'],['boolean'],['object'],['array'],['any']])
    (`Setting the type as %s returns the correct mutation`, (type) => {
        // @ts-ignore
        const mutations = new Mutation(type, 'name');
        expect(mutations.format()).toEqual(mutations[`${type}Mutation`])
    });

    test.each([['string'],['number'],['boolean'],['object'],['array'],['any']])
    (`The %s mutations set undefined and null values as null`, (type) => {
        let state = {name: null};
        // @ts-ignore
        const mutations = new Mutation(type, 'name');

        mutations.format()(state);
        expect(state.name).toEqual(null);

        mutations.format()(state, null);
        expect(state.name).toEqual(null)
    });

    test('The string mutation sets the correct value', () => {
        let state = {name: null};
        const mutations = new Mutation('string', 'name');
        const mutation = mutations.format();

        mutation(state, '');
        expect(state.name).toEqual(null);

        mutation(state, 'example');
        expect(state.name).toEqual('example')
    });

    test('The number mutation sets the correct value', () => {
        let state = {name: null};
        const mutations = new Mutation('number', 'name');
        const mutation = mutations.format();

        mutation(state, 0);
        expect(state.name).toEqual(0);

        mutation(state, 234567);
        expect(state.name).toEqual(234567)
    });

    test('The boolean mutation sets the correct value', () => {
        let state = {name: null};
        const mutations = new Mutation('boolean', 'name');
        const mutation = mutations.format();

        mutation(state, false);
        expect(state.name).toEqual(false);

        mutation(state, true);
        expect(state.name).toEqual(true);

        mutation(state, 0);
        expect(state.name).toEqual(false);

        mutation(state, 1);
        expect(state.name).toEqual(true);

        mutation(state, '');
        expect(state.name).toEqual(false);

        mutation(state, '234567');
        expect(state.name).toEqual(true)
    });

    test('The object mutation sets the correct value', () => {
        let state = {profile: null};
        const raw = new Mutation('object', 'profile');
        const mutation = raw.format();

        mutation(state, {});
        expect(state.profile).toEqual(null);

        const test_profile = {
            name: 'First Name',
            age: 22
        };
        mutation(state, test_profile);
        expect(state.profile).toEqual(test_profile);
    });
});
