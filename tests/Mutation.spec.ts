import Mutation from "~/Mutation";

describe('store/ModuleGenerator/Mutation.ts', () => {
    test.each([['string'],['number'],['boolean'],['object'],['array'],['any']])
    (`Setting the type as %s returns the correct mutation`, (type) => {
        // @ts-ignore
        const raw = new Mutation('name');
        // @ts-ignore
        expect(raw.format(type)).toEqual(raw[`${type}Mutation`])
    });

    test.each([['string'],['number'],['boolean'],['object'],['array'],['any']])
    (`The %s raw set undefined and null values as null`, (type) => {
        let state = {name: null};
        // @ts-ignore
        const raw = new Mutation('name');
        // @ts-ignore
        raw.format(type)(state);
        expect(state.name).toEqual(null);
        // @ts-ignore
        raw.format(type)(state, null);
        expect(state.name).toEqual(null)
    });

    test('The string mutation sets the correct value', () => {
        let state = {name: null};
        const raw = new Mutation('name');
        const mutation = raw.format('string');

        mutation(state, '');
        expect(state.name).toEqual(null);

        mutation(state, 'example');
        expect(state.name).toEqual('example')
    });

    test('The number mutation sets the correct value', () => {
        let state = {name: null};
        const raw = new Mutation('name');
        const mutation = raw.format('number');

        mutation(state, 0);
        expect(state.name).toEqual(0);

        mutation(state, 234567);
        expect(state.name).toEqual(234567)
    });

    test('The boolean mutation sets the correct value', () => {
        let state = {name: null};
        const raw = new Mutation('name');
        const mutation = raw.format('boolean');

        mutation(state, false);
        expect(state.name).toEqual(false);

        mutation(state, true);
        expect(state.name).toEqual(true);
    });

    test('The object mutation sets the correct value', () => {
        let state = {profile: null};
        const raw = new Mutation('profile');
        const mutation = raw.format('object');

        mutation(state, {});
        expect(state.profile).toEqual(null);

        const test_profile = {
            name: 'First Name',
            age: 22
        };
        mutation(state, test_profile);
        expect(state.profile).toEqual(test_profile);
    });

    test('The array mutation sets the correct value', () => {
        let state = {words: null};
        const raw = new Mutation('words');
        const mutation = raw.format('array');

        mutation(state, []);
        expect(state.words).toEqual(null);

        const test_words = ['some', 'test', 'words'];
        mutation(state, test_words);
        expect(state.words).toEqual(test_words);
    });
});
