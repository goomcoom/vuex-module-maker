// @ts-ignore
import Form from "vform";
import Mutation from "~/Mutation";
import InstructionProcessor from "~/InstructionProcessor";
import Config from "../src/Config";

describe('store/ModuleGenerator/Mutation.ts', () => {
    const config_class = new Config();
    const config = config_class.configure();

    test('If no value is passed the state property is set as null', () => {
        let state = {name: null};
        // @ts-ignore
        const raw = new Mutation(config);
        // @ts-ignore
        raw.format('string', 'name')(state);
        expect(state.name).toEqual(null);
        // @ts-ignore
        raw.format('string', 'name')(state, null);
        expect(state.name).toEqual(null)
    });

    test('The mutation sets the state prop equal to the value if passed', () => {
        let state = {name: null};
        const raw = new Mutation(config);
        const mutation = raw.format('string', 'name');

        mutation(state, 'example');
        expect(state.name).toEqual('example')
    });

    test('The mutation class sets the config property on instantiation', () => {
        const mutation = new Mutation(config);
        expect(JSON.stringify(mutation.config)).toEqual(JSON.stringify(config));
    });
});
