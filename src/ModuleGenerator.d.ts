import {ActionTree, GetterTree, ModuleTree, MutationTree} from "vuex";
import { Instructions } from "~/InstructionProcessor.d.ts";
import {Object} from "~/Types";


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
