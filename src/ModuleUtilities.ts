import { RawModule, Config } from "../types";
import { Getter, Mutation, Action, Module} from "vuex";

class ModuleUtilities<S, R> {
    protected _config: Config<S>;

    protected _module: RawModule = {
        namespaced: true,
        state: {},
        getters: {},
        mutations: {},
        actions: {},
        modules: {}
    };

    constructor(config: Config<S> = {}) {
        this.namespaced = config.namespaced === undefined ? true : config.namespaced;
        this._config = config;
    }

    get module() {
        return {
            namespaced: this._module.namespaced,
            state: () => this._module.state as S,
            getters: this._module.getters,
            mutations: this._module.mutations,
            actions: this._module.actions,
            modules: this._module.modules
        }
    }
    set module(value) {this._module = value}

    get namespaced(): boolean { return this._module.namespaced }
    set namespaced(value: boolean) { this._module.namespaced = value }

    get config(): Config<S> { return this._config}

    get state() { return this._module.state }
    set state(value ) { this._module.state = value }

    get getters() { return this._module.getters }
    get mutations() { return this._module.mutations }
    get actions() { return this._module.actions }
    get modules() { return this._module.modules }

    reset(): void {
        this._module = {
            namespaced: this.namespaced, state: {} as S, getters: {}, mutations: {}, actions: {}, modules: {}
        }
    }
    resetState(): void { this._module.state = {} as S }
    resetGetters(): void { this._module.getters = {} }
    resetMutations(): void { this._module.mutations = {} }
    resetActions(): void { this._module.actions = {} }
    resetModules(): void { this._module.modules = {} }

    addState(key: string, value: any): void {
        this.state[key] = value
    }
    addGetter(key: string, value: Getter<S, R>): void {
        this.getters[key] = value
    }
    addMutation(key: string, value: Mutation<S>): void {
        this.mutations[key] = value
    }
    addAction(key: string, value: Action<S, R>): void {
        this.actions[key] = value
    }
    addModule(key: string, value: Module<any, R>): void {
        this.modules[key] = value
    }

    removeState(key: string): void { delete this.state[key] }
    removeGetter(key: string): void { delete this.getters[key]}
    removeMutation(key: string): void { delete this.mutations[key]}
    removeAction(key: string): void { delete this.actions[key]}
    removeModule(key: string): void { delete this.modules[key]}
}

export default ModuleUtilities
