import ModuleMaker from '../src/ModuleMaker';
export default ModuleMaker;

export type DefaultTypes = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date';

export type Type<T> =
    T extends 'string' ? string :
        T extends 'number' ? number :
            T extends 'boolean' ? boolean :
                T extends 'array' ? any[] :
                    T extends 'object' ? object : any;

export interface Object {
    [x: string]: any
}

/* Instructions */
export interface Instruction<T extends Ts, Ts> {
    type: T,
    // State options
    set_state?: boolean,
    state_name?: string,
    initial_value?: any,
    // Getter options
    set_getter?: boolean,
    getter_name?: string,
    getter?: AnyGetter<any, any>,
    default_value?: any,
    // Mutation options
    set_mutation?: boolean,
    mutation_name?: string,
    mutation?: AnyMutation<any>,
}

export interface Instructions<Ts> {
    [x: string]: Ts | Instruction<Ts, Ts>
}

export interface FormattedInstruction<T extends Ts, Ts> {
    type: T,
    // State options
    set_state: boolean,
    state_name: string,
    state_value: any,
    // Getter options
    set_getter: boolean,
    getter_name: string,
    getter: AnyGetter<any, any>,
    //Mutation options
    set_mutation: boolean,
    mutation_name: string,
    mutation: AnyMutation<any>,
}

export type FormattedInstructions<Ts> = FormattedInstruction<Ts, Ts>[];

export interface Template<Ts> {
    namespaced?: boolean,
    instructions?: Instructions<Ts>,
    state?: {[x: string]: any}|(()=>{[x: string]: any}),
    getters?: {[x: string]: AnyGetter<any, any>,},
    mutations?: {[x: string]: AnyMutation<any>,},
    actions?: {[x: string]: any},
    modules?: {
        [x: string]: Template<Ts>
    }
}

export interface RawModule {
    namespaced: boolean,
    state: Object,
    getters: Object,
    mutations: Object,
    actions: Object,
    modules: Object
}

export interface Config {
    namespaced: boolean,
    naming: ConfigNaming,
    types: {
        default: {
            initial_value: null,
            default_value: null,
            getter: (x:string, y:string) => AnyGetter<any, any>,
            mutation: (x: string) => AnyMutation<any>,
        },
        [x: string]: ConfigTypeOptions
    }
}

export interface CustomConfig {
    namespaced?: boolean,
    naming?: CustomConfigNaming,
    types?: {
        [x: string]: ConfigTypeOptions
    }
}

export interface ConfigTypeOptions {
    initial_value?: any,
    default_value?: any,
    getter?: (x:string, y:string) => AnyGetter<any, any>,
    mutation?: (x: string) => AnyMutation<any>,
}

export type ConfigGetter = (state: { [x:string]: any }, getters?: any, rootState?: any, rootGetters?: any) => any;
export type ConfigMutation = (state: { [x:string]: any }, payload?: any)=>void;

export interface ConfigNaming {
    state: ConfigNamingOptions,
    getter: ConfigNamingOptions,
    mutation: ConfigNamingOptions,
}

export interface ConfigNamingOptions {
    prefix: string,
    suffix: string,
    transformer: (raw: string) => string,
}

export interface CustomConfigNaming {
    state?: CustomConfigNamingOptions,
    getter?: CustomConfigNamingOptions,
    mutation?: CustomConfigNamingOptions,
}

export interface CustomConfigNamingOptions {
    prefix?: string,
    suffix?: string,
    transformer?: (raw: string) => string,
}

export type StringGetter<S, R> = (state: S, getters?: any, rootState?: R, rootGetters?: any) => string;
export type NumberGetter<S, R> = (state: S, getters?: any, rootState?: R, rootGetters?: any) => number|null;
export type BooleanGetter<S, R> = (state: S, getters?: any, rootState?: R, rootGetters?: any) => boolean;
export type ArrayGetter<S, R> = (state: S, getters?: any, rootState?: R, rootGetters?: any) => any[];
export type ObjectGetter<S, R> = (state: S, getters?: any, rootState?: R, rootGetters?: any) => object|null;
export type AnyGetter<S, R> = (state: S, getters?: any, rootState?: R, rootGetters?: any) => any;

export type Getter<T extends DefaultTypes, S, R> =
    T extends 'string' ? StringGetter<S, R> :
        T extends 'number' ? NumberGetter<S, R> :
            T extends 'boolean' ? BooleanGetter<S, R> :
                T extends 'array' ? ArrayGetter<S, R> :
                    T extends 'object' ? ObjectGetter<S, R> : AnyGetter<S, R>;

export type StringMutation<S> = (state: S, value?: string ) => void;
export type NumberMutation<S> = (state: S, value?: number ) => void;
export type BooleanMutation<S> = (state: S, value?: boolean ) => void;
export type ArrayMutation<S> = (state: S, value?: any[] ) => void;
export type ObjectMutation<S> = (state: S, value?: object ) => void;
export type AnyMutation<S> = (state: S, payload?: any) => void;

export type Mutation<T extends DefaultTypes, S> =
    T extends 'string' ? StringMutation<S> :
        T extends 'number' ? NumberMutation<S> :
            T extends 'boolean' ? BooleanMutation<S> :
                T extends 'array' ? ArrayMutation<S> :
                    T extends 'object' ? ObjectMutation<S> : AnyMutation<S>;