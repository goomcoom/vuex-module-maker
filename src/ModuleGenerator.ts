interface I_Module {
    namespaced: boolean,
    state: IObject,
    getters: IObject,
    mutations: IObject,
    actions: IObject,
    modules: IObject,
}
interface IModule {
    namespaced: boolean,
    state(): IObject,
    getters: IObject,
    mutations: IObject,
    actions: IObject,
    modules: IObject,
}
interface IObject {
    [key: string]: any
}

class ModuleGenerator {
    private _module: I_Module = {
        namespaced: true, state: {}, getters: {}, mutations: {}, actions: {}, modules: {}
    };

    constructor(namespaced: boolean = true) {
        this.namespaced = namespaced
    }

    get module(): IModule {
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

    get state() :IObject { return this.module.state() }
    set state(value: IObject) { this._module.state = value }

    get getters() :IObject { return this.module.getters }
    set getters(value: IObject) { this._module.getters = value }

    get mutations() :IObject { return this.module.mutations }
    set mutations(value: IObject) { this._module.mutations = value }

    get actions() :IObject { return this.module.actions }
    set actions(value: IObject) { this._module.actions = value }

    get modules() :IObject { return this.module.modules }
    set modules(value: IObject) { this._module.modules = value }

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
    addGetter(key: string, value: (state: object, getters?: object) => any): void {
        this.getters[key] = value
    }
    addMutation(key: string, value: (state: object, payload?: any) => void): void {
        this.mutations[key] = value
    }
    addAction(key: string, value: (context: object, payload?: any) => void): void {
        this.actions[key] = value
    }
    addModule(key: string, value: IModule): void {
        this.modules[key] = value
    }

    removeState(key: string): void { delete this.state[key] }
    removeGetter(key: string): void { delete this.getters[key]}
    removeMutation(key: string): void { delete this.mutations[key]}
    removeAction(key: string): void { delete this.actions[key]}
    removeModule(key: string): void { delete this.modules[key]}
}


export default ModuleGenerator
