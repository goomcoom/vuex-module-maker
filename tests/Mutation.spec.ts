import Mutation from "~/Mutation";
import Config from "~/Config";

describe('store/ModuleGenerator/Mutation.ts', () => {
    const config_class = new Config();
    const config = config_class.configure();

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
});
