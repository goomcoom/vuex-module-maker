import * as D from "./declarations";
import Getter from "~/Getter";
import Mutation from "~/Mutation";
import { toCamelCase, toSnakeCase } from "~/helpers";

class InstructionProcessor {
    private _instructions: D.FormattedInstructions = [];
    readonly _raw: D.Instructions;
    private _state_name: string = '';

    get instructions(): D.FormattedInstructions { return this._instructions }
    get raw() :D.Instructions { return this._raw }
    get state_name() { return this._state_name }
    set state_name(value) { this._state_name = value }

    constructor (instructions: D.Instructions) {
        this._raw = instructions;
    }

    process(): D.FormattedInstructions {
        for (const [name, options] of Object.entries(this.raw)) {
            this.instructions.push(this.processInstruction(name, options));
            delete this.state_name
        }
        return this.instructions
    }

    processInstruction <T extends D.Types> (name: string, options: D.Instruction<T>): D.FormattedInstruction<T>
    {
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
            // Mutation options
            set_mutation: options.set_mutation == null ? true : options.set_mutation,
            mutation_name: this.formatMutationName(options),
            mutation: this.formatMutation(options.type),
        }
    }

    formatStateName <T extends D.Types> (name: string, options: D.Instruction<T>): string {
        if (options.state_name) return options.state_name;
        return this.state_name = toSnakeCase(name)
    }

    formatStateValue <T extends D.Types> (options: D.Instruction<T>): D.Type<T>|null {
        return options.initial_value == null ? null : options.initial_value
    }

    formatGetterName <T extends D.Types> (options: D.Instruction<T>): string {
        if (options.getter_name) return options.getter_name;
        return toCamelCase(`get_${this.state_name}`)
    }

    formatGetter <T extends D.Types> (options: D.Instruction<T>): D.Getter<T>
    {
        if (options.getter) return options.getter;
        const getters = new Getter(this.state_name, options.default_value);
        return getters.format(options.type)
    }

    formatMutationName <T extends D.Types> (options: D.Instruction<T>): string
    {
        if (options.mutation_name) return options.mutation_name;
        return toCamelCase(`set_${this.state_name}`)
    }

    formatMutation <T extends D.Types> (type: T): D.Mutation<T>
    {
        const raw = new Mutation(this.state_name);
        return raw.format(type)
    }
}

export default InstructionProcessor
