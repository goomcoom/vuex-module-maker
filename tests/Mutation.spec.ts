import Mutation from "~/Mutation";
import Config from "~/Config";

describe('store/ModuleGenerator/Mutation.ts', () => {
    const config_class = new Config();
    const config = config_class.configure();
    const mutation = new Mutation(config);

    test('If no value is passed the state property is set as null', () => {
        let state = {name: null};
        const raw = new Mutation(config);

        raw.format('string', 'name')(state);
        expect(state.name).toEqual(null);

        raw.format('string', 'name')(state, null);
        expect(state.name).toEqual(null)
    });

    test('The mutation class sets the config property on instantiation', () => {
        const mutation = new Mutation(config);
        expect(JSON.stringify(mutation.config)).toEqual(JSON.stringify(config));
    });

    test('The mutation sets the state prop equal to the value if passed', () => {
        let state = {name: null};
        const raw = new Mutation(config);
        const mutation = raw.format('string', 'name');

        mutation(state, 'example');
        expect(state.name).toEqual('example')
    });

    test('The mutation class returns the correct config mutation', () => {
        config.types.array.mutation = (state_name) => {
            return (state: any, value?: string[]): void => {
                state[state_name] = (value == null) ? ['I', 'like', 'this'] : value;
            };
        };

        const state = {thoughts: null};
        const formatter = new Mutation(config);
        const mutation = formatter.format('array', 'thoughts');

        mutation(state);
        expect(state.thoughts).toEqual(['I', 'like', 'this']);

        mutation(state, ['I', 'hate', 'this']);
        expect(state.thoughts).toEqual(['I', 'hate', 'this']);
    });

    test('The number mutation sets the correct value', () => {
        const state = { id: null };
        const number_mutation = mutation.format('number', 'id');

        number_mutation(state, 1);
        expect(state.id).toEqual(1);

        number_mutation(state, null);
        expect(state.id).toEqual(null);

        number_mutation(state, '34567');
        expect(state.id).toEqual(34567);

        number_mutation(state, 'not a number');
        expect(state.id).toEqual(null);

    });

    test('The date mutation sets the correct value', () => {
        const state = { dob: null };
        const date_mutation = mutation.format('date', 'dob');

        date_mutation(state, new Date('2020-01-01'));
        // @ts-ignore
        expect(state.dob.toDateString()).toEqual('Wed Jan 01 2020');

        date_mutation(state);
        expect(state.dob).toEqual(null);

        date_mutation(state, '1900-01-01');
        // @ts-ignore
        expect(state.dob.toDateString()).toEqual('Mon Jan 01 1900');

        date_mutation(state, '');
        expect(state.dob).toEqual(null);

        date_mutation(state, 997654290934);
        // @ts-ignore
        expect(state.dob.toDateString()).toEqual('Sun Aug 12 2001');

        date_mutation(state, 0);
        expect(state.dob).toEqual(null);

        date_mutation(state, config); // invalid date
        expect(state.dob).toEqual(null);
    });

    test('The object mutation sets the correct value', () => {
        const state = { title: null};
        const object_mutation = mutation.format('object', 'title');

        object_mutation(state, {id: 1, name: 'Mr'});
        expect(state.title).toEqual({id: 1, name: 'Mr'});

        object_mutation(state, {});
        expect(state.title).toEqual({});

        object_mutation(state);
        expect(state.title).toEqual(null);

        object_mutation(state, '{"id": 3, "name": "Dr"}');
        expect(state.title).toEqual({id: 3, name: 'Dr'});

        object_mutation(state, 'invalid JSON');
        expect(state.title).toEqual(null);
    })
});
