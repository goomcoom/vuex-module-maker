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
    getter?: (state: { [x:string]: any }, getters: any, rootState: any, rootGetters: any) => any,
    default_value?: any,
    // Mutation options
    set_mutation?: boolean,
    mutation_name?: string,
    mutation?: (state: { [x:string]: any }, payload?: any)=>void,
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
    getter: (state: { [x:string]: any }, getters: any, rootState: any, rootGetters: any) => any,
    //Mutation options
    set_mutation: boolean,
    mutation_name: string,
    mutation: (state: { [x:string]: any }, payload?: any)=>void,
}

export type FormattedInstructions<Ts> = FormattedInstruction<Ts, Ts>[];

export interface Template<Ts> {
    namespaced?: boolean,
    instructions?: Instructions<Ts>,
    state?: {[x: string]: any}|(()=>{[x: string]: any}),
    getters?: {[x: string]: (()=>any)},
    mutations?: {[x: string]: (()=>void)},
    actions?: {[x: string]: (()=>any)},
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
            getter: ConfigGetter,
            mutation: ConfigMutation,
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
    getter?: ConfigGetter,
    mutation?: ConfigMutation,
}

export type ConfigGetter = (state_name: string, default_value: any) => any
export type ConfigMutation = (state_name: string) => any

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

export type StringGetter<S> = (state: S) => string;
export type NumberGetter<S> = (state: S) => number|null;
export type BooleanGetter<S> = (state: S) => boolean;
export type ArrayGetter<S> = (state: S) => any[];
export type ObjectGetter<S> = (state: S) => object|null;

export type Getter<T extends DefaultTypes, S> =
    T extends 'string' ? StringGetter<S> :
        T extends 'number' ? NumberGetter<S> :
            T extends 'boolean' ? BooleanGetter<S> :
                T extends 'array' ? ArrayGetter<S> : ObjectGetter<S>;

export type StringMutation<S> = (state: S, value?: string ) => void;
export type NumberMutation<S> = (state: S, value?: number ) => void;
export type BooleanMutation<S> = (state: S, value?: boolean ) => void;
export type ArrayMutation<S> = (state: S, value?: any[] ) => void;
export type ObjectMutation<S> = (state: S, value?: object ) => void;

export type Mutation<T extends DefaultTypes, S> =
    T extends 'string' ? StringMutation<S> :
        T extends 'number' ? NumberMutation<S> :
            T extends 'boolean' ? BooleanMutation<S> :
                T extends 'array' ? ArrayMutation<S> : ObjectMutation<S>;