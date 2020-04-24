import { Types, Type } from "~/Types.d.ts"
import { Getter } from "vuex"
import { Mutation } from "~/Mutation.d.ts"


/* Instructions */
export interface Instruction<T extends Types, S, R> {
    type: T,
    // State options
    set_state?: boolean,
    state_name?: string,
    initial_value?: Type<T>,
    // Getter options
    set_getter?: boolean,
    getter_name?: string,
    getter?: Getter<S, R>,
    default_value?: Type<T>,
    // Mutation options
    set_mutation?: boolean,
    mutation_name?: string,
    mutation?: Mutation<T>
}

export interface Instructions<S, R> {
    [x: string]: Instruction<Types, S, R>
}

export interface FormattedInstruction<T extends Types, S, R> {
    type: T,
    // State options
    set_state: boolean,
    state_name: string,
    state_value: Type<T>|null,
    // Getter options
    set_getter: boolean,
    getter_name: string,
    getter: Getter<S, R>,
    //Mutation options
    set_mutation: boolean,
    mutation_name: string,
    mutation: Mutation<T>
}

export type FormattedInstructions<S, R> = FormattedInstruction<Types, S, R>[];
