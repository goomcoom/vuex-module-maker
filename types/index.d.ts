import {
    ActionTree, GetterTree, ModuleTree, MutationTree,
    Getter as VGetter, Mutation as VMutation
} from "vuex";
// @ts-ignore
import Form from "vform";

/* Types */
export type Types = 'string' | 'number' | 'boolean' | 'array' | 'form' | 'object' | 'any';

export type Type<T> =
    T extends 'string' ? string :
        T extends 'number' ? number :
            T extends 'boolean' ? boolean :
                T extends 'array' ? any[] :
                    T extends 'form' ? Form :
                        T extends 'object' ? object : any;

export interface Object {
    [x: string]: any
}

/* Getters */
export type StringGetter = <S>(state: S) => string;
export type NumberGetter = <S>(state: S) => number|null;
export type BooleanGetter = <S>(state: S) => boolean;
export type ArrayGetter = <S>(state: S) => any[];
export type FormGetter = <S>(state: S) => Form;
export type ObjectGetter = <S>(state: S) => object|null;
export type AnyGetter = <S>(state: S) => any;

export type Getter<T> =
    T extends 'string' ? StringGetter :
        T extends 'number' ? NumberGetter :
            T extends 'boolean' ? BooleanGetter :
                T extends 'array' ? ArrayGetter :
                    T extends 'form' ? FormGetter :
                        T extends 'object' ? ObjectGetter : AnyGetter;

export interface Getters {
    [x: string]: Getter<Types>
}

/* Mutations */
export type StringMutation = <S>(state: S, value?: string ) => void;
export type NumberMutation = <S>(state: S, value?: number ) => void;
export type BooleanMutation = <S>(state: S, value?: boolean ) => void;
export type ArrayMutation = <S>(state: S, value?: any[] ) => void;
export type FormMutation = <S>(state: S, value?: Object ) => void;
export type ObjectMutation = <S>(state: S, value?: object ) => void;
export type AnyMutation = <S>(state: S, value?: any ) => void;

export type Mutation<T> =
    T extends 'string' ? StringMutation :
        T extends 'number' ? NumberMutation :
            T extends 'boolean' ? BooleanMutation :
                T extends 'array' ? ArrayMutation :
                    T extends 'form' ? FormMutation :
                        T extends 'object' ? ObjectMutation : AnyMutation;

export interface Mutations {
    [x: string]: Mutation<Types>
}

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
    getter?: VGetter<S, R>,
    default_value?: Type<T>,
    // Mutation options
    set_mutation?: boolean,
    mutation_name?: string,
    mutation?: VMutation<S>
}

export interface Instructions<S, R> {
    [x: string]: Types | Instruction<Types, S, R>
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
    getter: VGetter<S, R>,
    //Mutation options
    set_mutation: boolean,
    mutation_name: string,
    mutation: VMutation<S>
}

export type FormattedInstructions<S, R> = FormattedInstruction<Types, S, R>[];

export interface Template<S, R> {
    instructions?: Instructions<S, R>,
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
    namespaced?: boolean,
    types?: {
        default: {
            default_value: null,
            getter: ConfigGetter<S, R>,
            mutation: ConfigMutation<S, R>
        },
        [x: string]: {
            default_value: any,
            getter?: ConfigGetter<S, R>,
            mutation?: ConfigMutation<S, R>
        }
    }
}

export interface CustomConfig<S, R> {
    namespaced?: boolean,
    types?: {
        [x: string]: {
            default_value?: any,
            getter?: VGetter<S, R>,
            mutation?: VMutation<S>
        }
    }
}

type ConfigGetter<S, R> = (state_name: string, default_value: any) => VGetter<S, R>
type ConfigMutation<S, R> = (state_name: string) => VMutation<S>