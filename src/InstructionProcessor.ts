import * as D from "../types";
import Getter from "./Getter";
import Mutation from "./Mutation";

class InstructionProcessor<Ts> {
    readonly _raw: D.Instructions<Ts>;
    get raw() { return this._raw }

    readonly _config: D.Config;
    get config() { return this._config }

    private _instructions: D.FormattedInstructions<Ts> = [];
    get instructions() { return this._instructions }

    private _state_name: string = '';
    get state_name() { return this._state_name }
    set state_name(value) { this._state_name = value }

    constructor (instructions: D.Instructions<Ts>, config: D.Config) {
        this._raw = instructions;
        this._config = config;
    }

    process(): D.FormattedInstructions<Ts> {
        let name: string;
        let options: Ts | D.Instruction<Ts,Ts>;
        for ([name, options] of Object.entries(this.raw)) {
            if (typeof options === 'string') options = {type: options};
            // @ts-ignore
            this.instructions.push(this.processInstruction(name, options));
            delete this.state_name
        }
        return this.instructions
    }

    processInstruction <T extends Ts> (name: string, options: D.Instruction<T, Ts>): D.FormattedInstruction<T, Ts>
    {
        return {
            type: options.type,
            // State options
            set_state: options.set_state == null ? true : options.set_state,
            state_name: this.formatStateName(name, options),
            state_value: this.formatStateValue(options),
            // Getter options
            set_getter: options.set_getter == null ? true : options.set_getter,
            getter_name: this.formatGetterName(name, options),
            getter: this.formatGetter(options),
            // Mutation options
            set_mutation: options.set_mutation == null ? true : options.set_mutation,
            mutation_name: this.formatMutationName(name, options),
            mutation: this.formatMutation(options.type),
        }
    }

    formatStateName <T extends Ts> (name: string, options: D.Instruction<T, Ts>): string {
        if (options.state_name) return this.state_name = options.state_name;

        const config = this.config.naming.state;
        return this.state_name = config.transformer(config.prefix + name + config.suffix);
    }

    formatStateValue <T extends Ts> (options: D.Instruction<T, Ts>): D.Type<T>|null {
        if (options.initial_value !== undefined) return options.initial_value;
        // @ts-ignore
        if (this.config.types[options.type] == null || this.config.types[options.type].initial_value === undefined) {
            return this.config.types.default.initial_value;
        }
        // @ts-ignore
        return this.config.types[options.type].initial_value;
    }

    formatGetterName <T extends Ts> (name: string, options: D.Instruction<T, Ts>): string {
        if (options.getter_name) return options.getter_name;

        const config = this.config.naming.getter;
        return config.transformer(config.prefix + name + config.suffix);
    }

    formatGetter <T extends Ts> (options: D.Instruction<T, Ts>): D.AnyGetter<any, any> {
        if (options.getter) return options.getter;
        const getters = new Getter(this.config);
        // @ts-ignore
        return getters.format(options.type, this.state_name, options.default_value);
    }

    formatMutationName <T extends Ts> (name: string, options: D.Instruction<T, Ts>): string {
        if (options.mutation_name) return options.mutation_name;
        const config = this.config.naming.mutation;
        return config.transformer(config.prefix + name + config.suffix);
    }

    formatMutation <T extends Ts> (type: T): D.AnyMutation<any> {
        const raw = new Mutation<Ts>(this.config);
        return raw.format(type, this.state_name);
    }
}

export default InstructionProcessor;
