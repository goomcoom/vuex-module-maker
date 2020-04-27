import Getter from "./Getter";
import Mutation from "./Mutation";
import { toCamelCase, toSnakeCase } from "./helpers";
import {Getter as VGetter, Mutation as VMutation} from "vuex";
import * as D from "../types";

class InstructionProcessor<S, R> {
    readonly _raw: D.Instructions<S, R>;
    get raw() { return this._raw }

    readonly _config: D.Config<S, R>;
    get config() { return this._config }

    private _instructions: D.FormattedInstructions<S, R> = [];
    get instructions() { return this._instructions }

    private _state_name: string = '';
    get state_name() { return this._state_name }
    set state_name(value) { this._state_name = value }

    constructor (instructions: D.Instructions<S, R>, config: D.Config<S, R>) {
        this._raw = instructions;
        this._config = config;
    }

    process(): D.FormattedInstructions<S, R> {
        for (let [name, options] of Object.entries(this.raw)) {
            if (typeof options === 'string') options = {type: options};
            this.instructions.push(this.processInstruction(name, options));
            delete this.state_name
        }
        return this.instructions
    }

    processInstruction <T extends D.Types> (name: string, options: D.Instruction<T, S, R>): D.FormattedInstruction<T, S, R>
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

    formatStateName <T extends D.Types> (name: string, options: D.Instruction<T, S, R>): string {
        name = options.state_name ? options.state_name : toSnakeCase(name);
        return this.state_name = name;
    }

    formatStateValue <T extends D.Types> (options: D.Instruction<T, S, R>): D.Type<T>|null {
        return options.initial_value == null ? null : options.initial_value
    }

    formatGetterName <T extends D.Types> (options: D.Instruction<T, S, R>): string {
        if (options.getter_name) return options.getter_name;
        return toCamelCase(`get_${this.state_name}`)
    }

    formatGetter <T extends D.Types> (options: D.Instruction<T, S, R>): VGetter<S, R>
    {
        if (options.getter) return options.getter;
        const getters = new Getter(this.config);
        return getters.format(options.type, this.state_name, options.default_value)
    }

    formatMutationName <T extends D.Types> (options: D.Instruction<T, S, R>): string
    {
        if (options.mutation_name) return options.mutation_name;
        return toCamelCase(`set_${this.state_name}`)
    }

    formatMutation <T extends D.Types> (type: T): VMutation<S>
    {
        const raw = new Mutation<S, R>(this.config);
        return raw.format(type, this.state_name)
    }
}

export default InstructionProcessor
