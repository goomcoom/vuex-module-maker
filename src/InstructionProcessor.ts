import { toCamelCase, toSnakeCase } from "~/helpers";
import Getters from "~/Getters";

interface IRawInstructions {
    [name: string]: IInstruction
}

interface IInstruction {
    type: 'string'|'number'|'boolean'|'object'|'array'|'any',
    // State options
    set_state?: boolean,
    state_name?: string,
    initial_value?: any,
    // Getter options
    set_getter?: boolean,
    getter_name?: string,
    getter?: (state: {[x: string]: any}, getters?: object) => any,
    default_value?: any,
}

interface IFormattedInstruction {
    type: 'string'|'number'|'boolean'|'object'|'array'|'any',
    // State options
    set_state: boolean,
    state_name: string,
    state_value: any,
    // Getter options
    set_getter: boolean,
    getter_name: string,
    getter: (state: {[x: string]: any}, getters?: object) => any
}


class InstructionProcessor {
    private _instructions: IFormattedInstruction[] = [];
    readonly _raw: IRawInstructions;
    private _state_name: string = '';

    get instructions() :IFormattedInstruction[] { return this._instructions }
    get raw() :IRawInstructions { return this._raw }
    get state_name() { return this._state_name }
    set state_name(value) { this._state_name = value }

    constructor(instructions: IRawInstructions) {
        this._raw = instructions
    }

    process() :IFormattedInstruction[] {
        for (const [name, options] of Object.entries(this.raw)) {
            this.instructions.push(this.processInstruction(name, options));
            delete this.state_name
        }
        return this.instructions
    }

    processInstruction(name: string, options: IInstruction): IFormattedInstruction {
        return {
            type: options.type,
            // State options
            set_state: options.set_state == null ? true : options.set_state,
            state_name: this.formatStateName(name, options),
            state_value: this.formatStateValue(options),
            // Getter options
            set_getter: options.set_getter == null ? true : options.set_getter,
            getter_name: this.formatGetterName(options),
            getter: this.formatGetter(options),
        }
    }

    formatStateName(name: string, options: IInstruction): string {
        if (options.state_name) return options.state_name;
        return this.state_name = toSnakeCase(name)
    }

    formatStateValue(options: IInstruction): any {
        return options.initial_value == null ? null : options.initial_value
    }

    formatGetterName(options: IInstruction): string {
        if (options.getter_name) return options.getter_name;
        return toCamelCase(`get_${this.state_name}`)
    }

    formatGetter(options: IInstruction): (state: {[x: string]: any; }) => any
    {
        if (options.getter) return options.getter;
        const getters = new Getters(options.type, this.state_name, options.default_value);
        return getters.getter()
    }
}

export default InstructionProcessor
