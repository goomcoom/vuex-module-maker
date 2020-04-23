import * as D from '~/declarations'

class ModuleUtilities {
    protected _module: D.Module = {
        namespaced: true, state: {}, getters: {}, mutations: {}, actions: {}, modules: {}
    };

    constructor(namespaced: boolean = true) {
        this.namespaced = namespaced
    }

    get module(): D.ExportModule {
        return {
            namespaced: this._module.namespaced,
            state: () => this._module.state,
            getters: this._module.getters,
            mutations: this._module.mutations,
            actions: this._module.actions,
            modules: this._module.modules
        }
    }
    set module(value) { this._module = value }

    get namespaced(): boolean { return this._module.namespaced}
    set namespaced(value: boolean) { this._module.namespaced = value }

    get state() :D.Object { return this.module.state() }
    set state(value: D.Object) { this._module.state = value }

    get getters() :D.Object { return this.module.getters }
    get mutations() :D.Object { return this.module.mutations }
    get actions() :D.Object { return this.module.actions }
    get modules() :D.Object { return this.module.modules }

    reset(): void {
        this._module = {
            namespaced: this.namespaced, state: {}, getters: {}, mutations: {}, actions: {}, modules: {}
        }
    }
    resetState(): void { this._module.state = {} }
    resetGetters(): void { this._module.getters = {} }
    resetMutations(): void { this._module.mutations = {} }
    resetActions(): void { this._module.actions = {} }
    resetModules(): void { this._module.modules = {} }

    addState(key: string, value: any): void {
        this.state[key] = value
    }
    addGetter(key: string, value: D.Getter<D.Types>): void {
        this.getters[key] = value
    }
    addMutation(key: string, value: D.Mutation<D.Types>): void {
        this.mutations[key] = value
    }
    addAction(key: string, value: D.Action): void {
        this.actions[key] = value
    }
    addModule(key: string, value: D.ExportModule): void {
        this.modules[key] = value
    }

    removeState(key: string): void { delete this.state[key] }
    removeGetter(key: string): void { delete this.getters[key]}
    removeMutation(key: string): void { delete this.mutations[key]}
    removeAction(key: string): void { delete this.actions[key]}
    removeModule(key: string): void { delete this.modules[key]}
}

export default ModuleUtilities
