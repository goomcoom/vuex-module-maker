/* Types */
export type Types = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';

export type Type<T> =
    T extends 'string' ? string :
        T extends 'number' ? number :
            T extends 'boolean' ? boolean :
                T extends 'array' ? any[] :
                    T extends 'object' ? object : any;

/* Getters */
export type StringGetter = (state: {[x: string]: any}, getters?: object) => string;
export type NumberGetter = (state: {[x: string]: any}, getters?: object) => number|null;
export type BooleanGetter = (state: {[x: string]: any}, getters?: object) => boolean;
export type ArrayGetter = (state: {[x: string]: any}, getters?: object) => any[];
export type ObjectGetter = (state: {[x: string]: any}, getters?: object) => object|null;
export type AnyGetter = (state: {[x: string]: any}, getters?: object) => any;

export type Getter<T> =
    T extends 'string' ? StringGetter :
        T extends 'number' ? NumberGetter :
            T extends 'boolean' ? BooleanGetter :
                T extends 'array' ? ArrayGetter :
                    T extends 'object' ? ObjectGetter : AnyGetter;


/* Mutations */
export type StringMutation = (state: {[x: string]: any}, value?: string ) => void;
export type NumberMutation = (state: {[x: string]: any}, value?: number ) => void;
export type BooleanMutation = (state: {[x: string]: any}, value?: boolean ) => void;
export type ArrayMutation = (state: {[x: string]: any}, value?: any[] ) => void;
export type ObjectMutation = (state: {[x: string]: any}, value?: object ) => void;
export type AnyMutation = (state: {[x: string]: any}, value?: any ) => void;

export type Mutation<T> =
    T extends 'string' ? StringMutation :
        T extends 'number' ? NumberMutation :
            T extends 'boolean' ? BooleanMutation :
                T extends 'array' ? ArrayMutation :
                    T extends 'object' ? ObjectMutation : AnyMutation;

/* Interfaces */
export interface Instruction<T extends Types> {
    type: Type<T>,
    // State options
    set_state?: boolean,
    state_name?: string,
    initial_value?: Type<T>,
    // Getter options
    set_getter?: boolean,
    getter_name?: string,
    getter?: Getter<T>,
    default_value?: Type<T>,
    // Mutation options
    set_mutation?: boolean,
    mutation_name?: string,
    mutation?: Mutation<T>
}

export interface Instructions {
    [x: string]: Instruction<Types>
}

export interface FormattedInstruction<T extends Types> {
    type: Type<T>,
    // State options
    set_state: boolean,
    state_name: string,
    state_value: Type<T>|null,
    // Getter options
    set_getter: boolean,
    getter_name: string,
    getter: Getter<T>,
    //Mutation options
    set_mutation: boolean,
    mutation_name: string,
    mutation: Mutation<T>
}

export type FormattedInstructions = FormattedInstruction<Types>[];

/* Modules */
export interface Object {
    [x: string]: any
}

export interface Module {
    namespaced: boolean,
    state: Object,
    getters: Object,
    mutations: Object,
    actions: Object,
    modules: Object,
}

export interface ExportModule {
    namespaced: boolean,
    state(): Object,
    getters: Object,
    mutations: Object,
    actions: Object,
    modules: Object,
}
