import InstructionProcessor from "~/InstructionProcessor";
import Getter from "~/Getter";

describe('store/ModuleGenerator/InstructionProcessor.ts', () => {

    test('The formatter has a required instruction property', () => {
        const formatter = new InstructionProcessor({id: {type: 'number'}});
        expect(Array.isArray(formatter.instructions)).toBe(true)
    });

    test('The formatter sets the raw instruction on instantiation', () => {
        const formatter = new InstructionProcessor({name: {type: 'string'}});
        expect(formatter.raw.name.type).toEqual('string')
    });

    test('The process method returns an array of processed instructions', () => {
        const processor = new InstructionProcessor({id: { type: 'number' }});
        expect(typeof processor.process()[0]).toEqual('object')
    });

    test('Specifying the state name takes precedence', () => {
        const processor = new InstructionProcessor({id:{type: 'number', state_name: 'userId' }});
        expect(processor.process()[0].state_name).toEqual('userId')
    });

    test('State names are converted to snake case', () => {
        const processor = new InstructionProcessor({ 'user Id': { type: 'number'}});
        expect(processor.process()[0].state_name).toEqual('user_id')
    });

    test('The set_state option can be controlled', () => {
        // Default
        let processor = new InstructionProcessor({id:{type: 'string'}});
        expect(processor.process()[0].set_state).toEqual(true);
        // True
        processor = new InstructionProcessor({id:{type: 'string', set_state: true}});
        expect(processor.process()[0].set_state).toEqual(true);
        // False
        processor = new InstructionProcessor({id:{type: 'string', set_state: false}});
        expect(processor.process()[0].set_state).toEqual(false)
    });

    test('The initial value can be controlled', () => {
        // Default
        let processor = new InstructionProcessor({id:{type: 'number'}});
        expect(processor.process()[0].state_value).toEqual(null);
        // null
        processor = new InstructionProcessor({id:{type: 'number', initial_value: null}});
        expect(processor.process()[0].state_value).toEqual(null);
        // number
        processor = new InstructionProcessor({id:{type: 'number', initial_value: 22}});
        expect(processor.process()[0].state_value).toEqual(22)
    });

    test('The set_getter option can be controlled', () => {
        // Default
        let processor = new InstructionProcessor({id:{type: 'array'}});
        expect(processor.process()[0].set_getter).toEqual(true);
        // True
        processor = new InstructionProcessor({id:{type: 'array', set_getter: true}});
        expect(processor.process()[0].set_getter).toEqual(true);
        // False
        processor = new InstructionProcessor({id:{type: 'array', set_getter: false}});
        expect(processor.process()[0].set_getter).toEqual(false)
    });

    test('Getter names are prefixed with "get"', () => {
        let processor = new InstructionProcessor({id:{type: 'number'}});
        expect(processor.process()[0].getter_name).toEqual('getId')
    });

    test('The getter_name option can be controlled', () => {
        const processor = new InstructionProcessor({id:{type: 'number', getter_name: 'getUserId'}});
        expect(processor.process()[0].getter_name).toEqual('getUserId')
    });

    test('The getter can be controlled', () => {
        let raw = new Getter('number', 'id');
        const getter = raw.format().toString();

        let processor = new InstructionProcessor({id: {type: 'number'}});
        expect(processor.process()[0].getter.toString()).toEqual(getter);

        const test_func = (state: {[x: string]: any}) => state.id * 100;
        processor = new InstructionProcessor({id: {type: 'number', getter: test_func}});
        expect(processor.process()[0].getter.toString()).toEqual(test_func.toString())
    });

    test('The default value can be controlled', () => {
        let processor = new InstructionProcessor({name: {type: 'string'}});
        expect(processor.process()[0].getter({name: null})).toEqual('');

        processor = new InstructionProcessor({name: {type: 'string', default_value: 'default text'}});
        expect(processor.process()[0].getter({name: null})).toEqual('default text')
    });

    test('The set_mutation property can be controlled', () => {
        // Default
        let processor = new InstructionProcessor({comments:{type: 'array'}});
        expect(processor.process()[0].set_mutation).toEqual(true);
        // True
        processor = new InstructionProcessor({comments:{type: 'array', set_mutation: true}});
        expect(processor.process()[0].set_mutation).toEqual(true);
        // False
        processor = new InstructionProcessor({comments:{type: 'array', set_mutation: false}});
        expect(processor.process()[0].set_mutation).toEqual(false)
    });
});
