import {
    ActionTree, GetterTree, ModuleTree, MutationTree,
    Getter as VGetter, Mutation as VMutation
} from "vuex";

/* Types */
export type DefaultTypes = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';

export type Types<Ts> = Ts extends unknown ? DefaultTypes : Ts;

export type Type<T> =
    T extends 'string' ? string :
        T extends 'number' ? number :
            T extends 'boolean' ? boolean :
                T extends 'array' ? any[] :
                    T extends 'object' ? object : any;

export interface Object {
    [x: string]: any
}

/* Getters */
export type StringGetter = <S>(state: S) => string;
export type NumberGetter = <S>(state: S) => number|null;
export type BooleanGetter = <S>(state: S) => boolean;
export type ArrayGetter = <S>(state: S) => any[];
export type ObjectGetter = <S>(state: S) => object|null;
export type AnyGetter = <S>(state: S) => any;

// export type Getter<T> =
//     T extends 'string' ? StringGetter :
//         T extends 'number' ? NumberGetter :
//             T extends 'boolean' ? BooleanGetter :
//                 T extends 'array' ? ArrayGetter :
//                     T extends 'form' ? FormGetter :
//                         T extends 'object' ? ObjectGetter : AnyGetter;
//
// export interface Getters {
//     [x: string]: Getter<Types>
// }

/* Mutations */
export type StringMutation = <S>(state: S, value?: string ) => void;
export type NumberMutation = <S>(state: S, value?: number ) => void;
export type BooleanMutation = <S>(state: S, value?: boolean ) => void;
export type ArrayMutation = <S>(state: S, value?: any[] ) => void;
export type ObjectMutation = <S>(state: S, value?: object ) => void;
export type AnyMutation = <S>(state: S, value?: any ) => void;

// export type Mutation<T> =
//     T extends 'string' ? StringMutation :
//         T extends 'number' ? NumberMutation :
//             T extends 'boolean' ? BooleanMutation :
//                 T extends 'array' ? ArrayMutation :
//                     T extends 'form' ? FormMutation :
//                         T extends 'object' ? ObjectMutation : AnyMutation;
//
// export interface Mutations {
//     [x: string]: Mutation<Types>
// }

/* Instructions */
export interface Instruction<T extends Types<Ts>, S, R, Ts> {
    type: T,
    // State options
    set_state?: boolean,
    state_name?: string,
    initial_value?: any,
    // Getter options
    set_getter?: boolean,
    getter_name?: string,
    getter?: VGetter<S, R>,
    default_value?: any,
    // Mutation options
    set_mutation?: boolean,
    mutation_name?: string,
    mutation?: VMutation<S>
}

export interface Instructions<S, R, Ts> {
    [x: string]: Types<Ts> | Instruction<Types<Ts>, S, R, Ts>
}

export interface FormattedInstruction<T extends Types<Ts>, S, R, Ts> {
    type: T,
    // State options
    set_state: boolean,
    state_name: string,
    state_value: Type<T>|null,
    // Getter options
    set_getter: boolean,
    getter_name: string,
    getter: VGetter<S, R>,
    //Mutation options
    set_mutation: boolean,
    mutation_name: string,
    mutation: VMutation<S>
}

export type FormattedInstructions<S, R, Ts> = FormattedInstruction<Types<Ts>, S, R, Ts>[];

export interface Template<S, R, Ts> {
    instructions?: Instructions<S, R, Ts>,
    state?: Object,
    getters?: GetterTree<S, R>,
    mutations?: MutationTree<S>,
    actions?: ActionTree<S, R>,
    modules?: ModuleTree<R>
}

export interface RawModule {
    namespaced: boolean,
    state: Object,
    getters: Object,
    mutations: Object,
    actions: Object,
    modules: Object
}

export interface Config<S, R> {
    namespaced: boolean,
    types: {
        default: {
            default_value: null,
            getter: ConfigGetter<S, R>,
            mutation: ConfigMutation<S>
        },
        [x: string]: ConfigTypeOptions<S, R>
    }
}

export interface CustomConfig<S, R> {
    namespaced?: boolean,
    types?: {
        [x: string]: ConfigTypeOptions<S, R>
    }
}

export interface ConfigTypeOptions<S, R> {
    default_value?: any,
    getter?: ConfigGetter<S, R>,
    mutation?: ConfigMutation<S>
}

type ConfigGetter<S, R> = (state_name: string, default_value: any) => VGetter<S, R>
type ConfigMutation<S> = (state_name: string) => VMutation<S>