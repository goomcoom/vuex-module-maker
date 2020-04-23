export interface Object {
    [x: string]: any
}

/* Types */
export type Types = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';

export type Type<T> =
    T extends 'string' ? string :
        T extends 'number' ? number :
            T extends 'boolean' ? boolean :
                T extends 'array' ? any[] :
                    T extends 'object' ? object : any;

/* Getters */
export type StringGetter = (state: Object, getters?: Object) => string;
export type NumberGetter = (state: Object, getters?: Object) => number|null;
export type BooleanGetter = (state: Object, getters?: Object) => boolean;
export type ArrayGetter = (state: Object, getters?: Object) => any[];
export type ObjectGetter = (state: Object, getters?: Object) => object|null;
export type AnyGetter = (state: Object, getters?: Object) => any;

export type Getter<T> =
    T extends 'string' ? StringGetter :
        T extends 'number' ? NumberGetter :
            T extends 'boolean' ? BooleanGetter :
                T extends 'array' ? ArrayGetter :
                    T extends 'object' ? ObjectGetter : AnyGetter;

export interface Getters {
    [x: string]: Getter<Types>
}


/* Mutations */
export type StringMutation = (state: Object, value?: string ) => void;
export type NumberMutation = (state: Object, value?: number ) => void;
export type BooleanMutation = (state: Object, value?: boolean ) => void;
export type ArrayMutation = (state: Object, value?: any[] ) => void;
export type ObjectMutation = (state: Object, value?: object ) => void;
export type AnyMutation = (state: Object, value?: any ) => void;

export type Mutation<T> =
    T extends 'string' ? StringMutation :
        T extends 'number' ? NumberMutation :
            T extends 'boolean' ? BooleanMutation :
                T extends 'array' ? ArrayMutation :
                    T extends 'object' ? ObjectMutation : AnyMutation;

export interface Mutations {
    [x: string]: Mutation<Types>
}

export type Action = (context: Object, payload?: any) => any

export interface Actions {
    [x: string]: Action
}


/* Instructions */
export interface Instruction<T extends Types> {
    type: T,
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
    type: T,
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
export interface Module {
    namespaced: boolean,
    state: Object,
    getters: Getters,
    mutations: Mutations,
    actions: Object,
    modules: Object,
}

export interface ExportModule {
    namespaced: boolean,
    state(): Object,
    getters: Getters,
    mutations: Mutations,
    actions: Object,
    modules: Object,
}

export interface Template {
    instructions?: Instructions,
    state?: Object,
    getters?: Object,
    mutations?: Object,
    actions?: Object,
    modules?: Object
}
