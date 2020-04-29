import * as D from "../types";
import Getter from "./Getter";
import Mutation from "./Mutation";
import { toCamelCase, toSnakeCase } from "./helpers";
import {Getter as VGetter, Mutation as VMutation} from "vuex";

class InstructionProcessor<S, R, Ts> {
    readonly _raw: D.Instructions<S, R, Ts>;
    get raw() { return this._raw }

    readonly _config: D.Config<S, R>;
    get config() { return this._config }

    private _instructions: D.FormattedInstructions<S, R, Ts> = [];
    get instructions() { return this._instructions }

    private _state_name: string = '';
    get state_name() { return this._state_name }
    set state_name(value) { this._state_name = value }

    constructor (instructions: D.Instructions<S, R, Ts>, config: D.Config<S, R>) {
        this._raw = instructions;
        this._config = config;
    }

    process(): D.FormattedInstructions<S, R, Ts> {
        let name: string;
        let options: Ts | D.Instruction<Ts, S, R, Ts>;
        for ([name, options] of Object.entries(this.raw)) {
            if (typeof options === 'string') options = {type: options};
            // @ts-ignore
            this.instructions.push(this.processInstruction(name, options));
            delete this.state_name
        }
        return this.instructions
    }

    processInstruction <T extends Ts> (name: string, options: D.Instruction<T, S, R, Ts>): D.FormattedInstruction<T, S, R, Ts>
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

    formatStateName <T extends Ts> (name: string, options: D.Instruction<T, S, R, Ts>): string {
        name = options.state_name ? options.state_name : toSnakeCase(name);
        return this.state_name = name;
    }

    formatStateValue <T extends Ts> (options: D.Instruction<T, S, R, Ts>): D.Type<T>|null {
        if (options.initial_value !== undefined) return options.initial_value;
        // @ts-ignore
        if (this.config.types[options.type] === null || this.config.types[options.type].initial_value === undefined) {
            return this.config.types.default.initial_value;
        }
        // @ts-ignore
        return this.config.types[options.type].initial_value;
    }

    formatGetterName <T extends Ts> (options: D.Instruction<T, S, R, Ts>): string {
        if (options.getter_name) return options.getter_name;
        return toCamelCase(`get_${this.state_name}`)
    }

    formatGetter <T extends Ts> (options: D.Instruction<T, S, R, Ts>): VGetter<S, R>
    {
        if (options.getter) return options.getter;
        const getters = new Getter(this.config);

        // @ts-ignore
        return getters.format(options.type, this.state_name, options.default_value)
    }

    formatMutationName <T extends Ts> (options: D.Instruction<T, S, R, Ts>): string
    {
        if (options.mutation_name) return options.mutation_name;
        return toCamelCase(`set_${this.state_name}`)
    }

    formatMutation <T extends Ts> (type: T): VMutation<S>
    {
        const raw = new Mutation<S, R, Ts>(this.config);
        return raw.format(type, this.state_name)
    }
}

export default InstructionProcessor
