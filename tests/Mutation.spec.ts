// @ts-ignore
import Form from "vform";
import Mutation from "~/Mutation";
import InstructionProcessor from "~/InstructionProcessor";
import Config from "../src/Config";

describe('store/ModuleGenerator/Mutation.ts', () => {
    const config_class = new Config();
    const config = config_class.configure();

    test('The set_mutation property can be controlled', () => {
        // Default
        let processor = new InstructionProcessor({comments:{type: 'array'}}, config);
        expect(processor.process()[0].set_mutation).toEqual(true);
        // True
        processor = new InstructionProcessor({comments:{type: 'array', set_mutation: true}}, config);
        expect(processor.process()[0].set_mutation).toEqual(true);
        // False
        processor = new InstructionProcessor({comments:{type: 'array', set_mutation: false}}, config);
        expect(processor.process()[0].set_mutation).toEqual(false)
    });

    test('The mutation_name can be controlled', () => {
        const processor = new InstructionProcessor({id:{type: 'number', mutation_name: 'setUserId'}}, config);
        expect(processor.process()[0].mutation_name).toEqual('setUserId')
    });

    test('If no value is passed the state property is set as null', () => {
        let state = {name: null};
        // @ts-ignore
        const raw = new Mutation('name');
        // @ts-ignore
        raw.format('string')(state);
        expect(state.name).toEqual(null);
        // @ts-ignore
        raw.format('string')(state, null);
        expect(state.name).toEqual(null)
    });

    test('The mutation sets the state prop equal to the value if passed', () => {
        let state = {name: null};
        const raw = new Mutation('name');
        const mutation = raw.format('string');

        mutation(state, 'example');
        expect(state.name).toEqual('example')
    });
});
