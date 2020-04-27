import InstructionProcessor from "~/InstructionProcessor";
import Getter from "~/Getter";
import * as D from "../types";
import Config from "../src/Config";

interface S { [x: string]: any }
interface R { [x: string]: any }

describe('store/ModuleGenerator/InstructionProcessor.ts', () => {
    const config_class = new Config();
    const config = config_class.configure();

    test('The formatter has an instruction property', () => {
        const formatter = new InstructionProcessor({id: {type: 'number'}}, config);
        expect(Array.isArray(formatter.instructions)).toBe(true)
    });

    test('The instructions can be just the type string', () => {
        const raw_instructions: D.Instructions<S, R> = {
            comments: 'array'
        };

        const formatter = new InstructionProcessor<S, R>(raw_instructions, config);
        const instruction = formatter.process()[0];

        expect(instruction.state_name).toEqual('comments');
        expect(instruction.getter_name).toEqual('getComments');
        expect(instruction.mutation_name).toEqual('setComments');
    });

    test('The formatter sets the raw instruction on instantiation', () => {
        const raw_instruction: D.Instructions<S, R> = {
            name: {
                type: 'string'
            }
        };
        const formatter = new InstructionProcessor<S, R>(raw_instruction, config);
        expect(formatter.raw).toEqual(raw_instruction)
    });

    test('The formatter sets the config on instantiation', () => {
        const raw_instruction: D.Instructions<S, R> = {
            name: {
                type: 'string'
            }
        };
        const formatter = new InstructionProcessor<S, R>(raw_instruction, config);
        expect(formatter.config).toEqual(config)
    });

    test('The process method returns an array of processed instructions', () => {
        const processor = new InstructionProcessor({id: { type: 'number' }}, config);
        expect(typeof processor.process()[0]).toEqual('object')
    });

    test('Specifying the state name takes precedence', () => {
        const processor = new InstructionProcessor({id:{type: 'number', state_name: 'userId' }}, config);
        expect(processor.process()[0].state_name).toEqual('userId')
    });

    test('State names are converted to snake case', () => {
        const processor = new InstructionProcessor({ 'user Id': { type: 'number'}}, config);
        expect(processor.process()[0].state_name).toEqual('user_id')
    });

    test('The set_state option can be controlled', () => {
        // Default
        let processor = new InstructionProcessor({id:{type: 'string'}}, config);
        expect(processor.process()[0].set_state).toEqual(true);
        // True
        processor = new InstructionProcessor({id:{type: 'string', set_state: true}}, config);
        expect(processor.process()[0].set_state).toEqual(true);
        // False
        processor = new InstructionProcessor({id:{type: 'string', set_state: false}}, config);
        expect(processor.process()[0].set_state).toEqual(false)
    });

    test('The initial value can be controlled', () => {
        // Default
        let processor = new InstructionProcessor({id:{type: 'number'}}, config);
        expect(processor.process()[0].state_value).toEqual(null);
        // null
        processor = new InstructionProcessor({id:{type: 'number', initial_value: null}}, config);
        expect(processor.process()[0].state_value).toEqual(null);
        // number
        processor = new InstructionProcessor({id:{type: 'number', initial_value: 22}}, config);
        expect(processor.process()[0].state_value).toEqual(22)
    });

    test('The set_getter option can be controlled', () => {
        // Default
        let processor = new InstructionProcessor({id:{type: 'array'}}, config);
        expect(processor.process()[0].set_getter).toEqual(true);
        // True
        processor = new InstructionProcessor({id:{type: 'array', set_getter: true}}, config);
        expect(processor.process()[0].set_getter).toEqual(true);
        // False
        processor = new InstructionProcessor({id:{type: 'array', set_getter: false}}, config);
        expect(processor.process()[0].set_getter).toEqual(false)
    });

    test('Getter names are prefixed with "get"', () => {
        let processor = new InstructionProcessor({id:{type: 'number'}}, config);
        expect(processor.process()[0].getter_name).toEqual('getId')
    });

    test('The getter_name option can be controlled', () => {
        const processor = new InstructionProcessor({id:{type: 'number', getter_name: 'getUserId'}}, config);
        expect(processor.process()[0].getter_name).toEqual('getUserId')
    });

    test('The getter can be controlled', () => {
        let raw = new Getter('id');
        const getter = raw.format('number').toString();

        let processor = new InstructionProcessor<S, R>({id: {type: 'number'}}, config);
        expect(processor.process()[0].getter.toString()).toEqual(getter);

        const test_func = (state: {[x: string]: any}) => state.id * 100;
        processor = new InstructionProcessor({id: {type: 'number', getter: test_func}}, config);
        expect(processor.process()[0].getter.toString()).toEqual(test_func.toString())
    });

    test('The default value can be controlled', () => {
        let processor = new InstructionProcessor({name: {type: 'string'}}, config);
        const state = {
            name: null
        };
        expect(processor.process()[0].getter(state, {}, {}, {})).toEqual('');

        processor = new InstructionProcessor({name: {type: 'string', default_value: 'default text'}}, config);
        expect(processor.process()[0].getter(state, {}, {}, {})).toEqual('default text')
    });
});
