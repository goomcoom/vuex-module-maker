import * as D from "../types";
import ModuleUtilities from "./ModuleUtilities";
import InstructionProcessor from "./InstructionProcessor";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {Config, Template} from "../types";

class ModuleMaker<S, R, Ts> extends ModuleUtilities<R> {

    constructor(template: Template<S, R, Ts>, config: D.CustomConfig<R> = {})
    {
        super(config);
        this.make<S>(template)

        // @ts-ignore
        return {
            namespaced: this.namespaced,
            state: () => this.state,
            getters: this.getters,
            mutations: this.mutations,
            actions: this.actions,
            modules: this.modules,
        };
    }

    make<S>(template: D.Template<S, R, Ts>): any
    {
        this.reset()

        if (template.namespaced != null) this.namespaced = template.namespaced;
        if (template.instructions) this.executeInstructions<S>(template.instructions);
        if (template.state) this.addStateProperties<S>(template.state);
        if (template.getters) this.addGetters<S>(template.getters);
        if (template.mutations) this.addMutations<S>(template.mutations);
        if (template.actions) this.addActions<S>(template.actions);
        if (template.modules) this.addModules<S>(template.modules);

        return this.module;
    }
    public static Make<Module, Types>(template: Template<Types>, config?: Config): Module
    {
        const maker = new ModuleMaker(config);
        return maker.make(template) as Module;
    }

    private executeInstructions<S>(raw: D.Instructions<S, R, Ts>): void
    {
        const processor = new InstructionProcessor<S, R, Ts>(raw, this.config);
        const instructions = processor.process();

        instructions.forEach((i: D.FormattedInstruction<Ts, S, R, Ts>) => {
            if (i.set_state) this.addState(i.state_name, i.state_value);
            if (i.set_getter) this.addGetter(i.getter_name, i.getter);
            if (i.set_mutation) this.addMutation(i.mutation_name, i.mutation);
        });
    }

    private addStateProperties<S>(properties: Object | (() => S)): void
    {
        if (typeof properties === 'function') properties = properties();

        for (const [key, value] of Object.entries(properties)) {
            this.addState(key, value)
        }
    }

    private addGetters<S>(getters: GetterTree<S, R>): void
    {
        for (const [key, value] of Object.entries(getters)) {
            this.addGetter(key, value);
        }
    }

    private addMutations<S>(mutations: MutationTree<S>): void
    {
        for (const [key, value] of Object.entries(mutations)) {
            this.addMutation(key, value);
        }
    }

    private addActions<S>(actions: ActionTree<S, R>): void
    {
        for (const [key, value] of Object.entries(actions)) {
            this.addAction(key, value);
        }
    }

    private addModules<S>(modules: Module<S, R>): void
    {
        for (const [key, value] of Object.entries(modules)) {
            this.addModule(key, new ModuleMaker<S, R, Ts>(value, this.config));
        }
    }
}

export default ModuleMaker
