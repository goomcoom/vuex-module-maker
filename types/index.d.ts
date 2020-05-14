import {
    ActionTree, GetterTree, ModuleTree, MutationTree,
    Getter as VGetter, Mutation as VMutation
} from "vuex";

import ModuleMaker from '../src/ModuleMaker';
export default ModuleMaker;

export type DefaultTypes = 'string' | 'number' | 'boolean' | 'array' | 'object';

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
export interface Instruction<T extends Ts, S, R, Ts> {
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
    [x: string]: Ts | Instruction<Ts, S, R, Ts>
}

export interface FormattedInstruction<T extends Ts, S, R, Ts> {
    type: T,
    // State options
    set_state: boolean,
    state_name: string,
    state_value: any,
    // Getter options
    set_getter: boolean,
    getter_name: string,
    getter: VGetter<S, R>,
    //Mutation options
    set_mutation: boolean,
    mutation_name: string,
    mutation: VMutation<S>
}

export type FormattedInstructions<S, R, Ts> = FormattedInstruction<Ts, S, R, Ts>[];

export interface Template<S, R, Ts> {
    namespaced?: boolean,
    instructions?: Instructions<S, R, Ts>,
    state?: Object|(()=>S),
    getters?: GetterTree<S, R>,
    mutations?: MutationTree<S>,
    actions?: ActionTree<S, R>,
    modules?: {
        [x: string]: Template<S, R, Ts>
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

export interface Config<R> {
    namespaced: boolean,
    naming: ConfigNaming,
    types: {
        default: {
            initial_value: null,
            default_value: null,
            getter: ConfigGetter<any, R>,
            mutation: ConfigMutation<any>
        },
        [x: string]: ConfigTypeOptions<any, R>
    }
}

export interface CustomConfig<R> {
    namespaced?: boolean,
    naming?: CustomConfigNaming,
    types?: {
        [x: string]: ConfigTypeOptions<any, R>
    }
}

export interface ConfigTypeOptions<S, R> {
    initial_value?: any,
    default_value?: any,
    getter?: ConfigGetter<S, R>,
    mutation?: ConfigMutation<S>
}

export type ConfigGetter<S, R> = (state_name: string, default_value: any) => VGetter<S, R>
export type ConfigMutation<S> = (state_name: string) => VMutation<S>

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