import InstructionProcessor from "~/InstructionProcessor";
import Getter from "~/Getter";
import * as D from "../types";
import Config from "~/Config";

interface S { [x: string]: any }
interface R { [x: string]: any }
type Ts = unknown;

describe('store/ModuleGenerator/InstructionProcessor.ts', () => {
    let config: D.Config<S, R>;

    beforeEach(() => {
        const config_class = new Config<S, R>();
        config = config_class.configure()
    });

    test('The formatter has an instruction property', () => {
        const formatter = new InstructionProcessor({id: {type: 'number'}}, config);
        expect(Array.isArray(formatter.instructions)).toBe(true)
    });

    test('The instructions can be just the type string', () => {
        const raw_instructions: D.Instructions<S, R, Ts> = {
            comments: 'array'
        };

        const formatter = new InstructionProcessor<S, R, Ts>(raw_instructions, config);
        const instruction = formatter.process()[0];

        expect(instruction.state_name).toEqual('comments');
        expect(instruction.getter_name).toEqual('getComments');
        expect(instruction.mutation_name).toEqual('setComments');
    });

    test('The formatter sets the raw instruction on instantiation', () => {
        const raw_instruction: D.Instructions<S, R, Ts> = {
            name: {
                type: 'string'
            }
        };
        const formatter = new InstructionProcessor<S, R, Ts>(raw_instruction, config);
        expect(formatter.raw).toEqual(raw_instruction)
    });

    test('The formatter sets the config on instantiation', () => {
        const raw_instruction: D.Instructions<S, R, Ts> = {
            name: {
                type: 'string'
            }
        };
        const formatter = new InstructionProcessor<S, R, Ts>(raw_instruction, config);
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

    test('Default state naming config work as expected', () => {
        let processor = new InstructionProcessor({ 'user Id': { type: 'number'}}, config);
        expect(processor.process()[0].state_name).toEqual('user_id');

        processor = new InstructionProcessor({ first_name: { type: 'string'}}, config);
        expect(processor.process()[0].state_name).toEqual('first_name');
    });

    test('The state naming config can be controlled', () => {
        config.naming.state.prefix = 'state_';
        config.naming.state.suffix = '_prop';
        config.naming.state.transformer = (raw) => raw.toUpperCase();

        let processor = new InstructionProcessor({ 'user_Id': { type: 'number'}}, config);
        expect(processor.process()[0].state_name).toEqual('STATE_USER_ID_PROP');
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

    test('The processor returns the type specific config initial_value if defined', () => {
        // Boolean config has initial_value prop
        let processor = new InstructionProcessor({id:{type: 'boolean'}}, config);
        expect(processor.process()[0].state_value).toEqual(false);
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

    test('The getter_name option can be controlled', () => {
        const processor = new InstructionProcessor({id:{type: 'number', getter_name: 'getUserId'}}, config);
        expect(processor.process()[0].getter_name).toEqual('getUserId')
    });

    test('Default getter naming config sets names as expected', () => {
        let processor = new InstructionProcessor({id:{type: 'number'}}, config);
        expect(processor.process()[0].getter_name).toEqual('getId')
    });

    test('The getter naming config can be controlled', () => {
        config.naming.getter.prefix = 'getter_';
        config.naming.getter.suffix = '_method';
        config.naming.getter.transformer = (raw) => raw.toUpperCase();

        let processor = new InstructionProcessor({ 'user_Id': { type: 'number'}}, config);
        expect(processor.process()[0].getter_name).toEqual('GETTER_USER_ID_METHOD');
    });

    test('The getter can be controlled', () => {
        let raw = new Getter(config);
        const getter = raw.format('number', 'id').toString();

        let processor = new InstructionProcessor<S, R, Ts>({id: {type: 'number'}}, config);
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

    test('Default mutation naming config sets names as expected', () => {
        let processor = new InstructionProcessor({id:{type: 'number'}}, config);
        expect(processor.process()[0].mutation_name).toEqual('setId')
    });

    test('The mutation naming config can be controlled', () => {
        config.naming.mutation.prefix = 'mutation_';
        config.naming.mutation.suffix = '_method';
        config.naming.mutation.transformer = (raw) => raw.toUpperCase();

        let processor = new InstructionProcessor({ 'user_Id': { type: 'number'}}, config);
        expect(processor.process()[0].mutation_name).toEqual('MUTATION_USER_ID_METHOD');
    });

    test('The mutation_name can be controlled', () => {
        const processor = new InstructionProcessor({id:{type: 'number', mutation_name: 'setUserId'}}, config);
        expect(processor.process()[0].mutation_name).toEqual('setUserId')
    });
});
