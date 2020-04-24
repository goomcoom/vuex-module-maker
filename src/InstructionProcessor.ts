import Getter from "~/Getter";
import Mutation from "~/Mutation";
import { toCamelCase, toSnakeCase } from "~/helpers";
import { Types, Type } from "~/Types.d.ts";
import {Getter as VGetter} from "vuex";
import {Mutation as IMutation} from "~/Mutation.d.ts";
import * as D from "~/InstructionProcessor.d.ts";

class InstructionProcessor<S, R> {
    private _instructions: D.FormattedInstructions<S, R> = [];
    readonly _raw: D.Instructions<S, R>;
    private _state_name: string = '';

    get instructions() { return this._instructions }
    get raw() { return this._raw }
    get state_name() { return this._state_name }
    set state_name(value) { this._state_name = value }

    constructor (instructions: D.Instructions<S, R>) {
        this._raw = instructions;
    }

    process(): D.FormattedInstructions<S, R> {
        for (const [name, options] of Object.entries(this.raw)) {
            this.instructions.push(this.processInstruction(name, options));
            delete this.state_name
        }
        return this.instructions
    }

    processInstruction <T extends Types> (name: string, options: D.Instruction<T, S, R>): D.FormattedInstruction<T, S, R>
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

    formatStateName <T extends Types> (name: string, options: D.Instruction<T, S, R>): string {
        if (options.state_name) return options.state_name;
        return this.state_name = toSnakeCase(name)
    }

    formatStateValue <T extends Types> (options: D.Instruction<T, S, R>): Type<T>|null {
        return options.initial_value == null ? null : options.initial_value
    }

    formatGetterName <T extends Types> (options: D.Instruction<T, S, R>): string {
        if (options.getter_name) return options.getter_name;
        return toCamelCase(`get_${this.state_name}`)
    }

    formatGetter <T extends Types> (options: D.Instruction<T, S, R>): VGetter<S, R>
    {
        if (options.getter) return options.getter;
        const getters = new Getter(this.state_name, options.default_value);
        return getters.format(options.type)
    }

    formatMutationName <T extends Types> (options: D.Instruction<T, S, R>): string
    {
        if (options.mutation_name) return options.mutation_name;
        return toCamelCase(`set_${this.state_name}`)
    }

    formatMutation <T extends Types> (type: T): IMutation<T>
    {
        const raw = new Mutation(this.state_name);
        return raw.format(type)
    }
}

export default InstructionProcessor
