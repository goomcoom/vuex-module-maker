import * as D from "../types";
import ModuleUtilities from "./ModuleUtilities";
import InstructionProcessor from "./InstructionProcessor";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex";

class ModuleMaker<S, R, Ts> extends ModuleUtilities<S, R> {

    constructor(config: D.CustomConfig<S, R> = {}) {
        super(config);
    }

    make(template: D.Template<S, R, Ts>): Module<S, R>
    {
        if (template.instructions) this.executeInstructions(template.instructions);
        if (template.state) this.addStateProperties(template.state);
        if (template.getters) this.addGetters(template.getters);
        if (template.mutations) this.addMutations(template.mutations);
        if (template.actions) this.addActions(template.actions);
        if (template.modules) this.addModules(template.modules);

        return this.module;
    }

    private executeInstructions(raw: D.Instructions<S, R, Ts>): void
    {
        const processor = new InstructionProcessor<S, R, Ts>(raw, this.config);
        const instructions = processor.process();

        instructions.forEach((i: D.FormattedInstruction<Ts, S, R, Ts>) => {
            if (i.set_state) this.addState(i.state_name, i.state_value);
            if (i.set_getter) this.addGetter(i.getter_name, i.getter);
            if (i.set_mutation) this.addMutation(i.mutation_name, i.mutation);
        });
    }

    private addStateProperties(properties: Object): void
    {
        for (const [key, value] of Object.entries(properties)) {
            this.addState(key, value)
        }
    }

    private addGetters(getters: GetterTree<S, R>): void
    {
        for (const [key, value] of Object.entries(getters)) {
            this.addGetter(key, value);
        }
    }

    private addMutations(mutations: MutationTree<S>): void
    {
        for (const [key, value] of Object.entries(mutations)) {
            this.addMutation(key, value);
        }
    }

    private addActions(actions: ActionTree<S, R>): void
    {
        for (const [key, value] of Object.entries(actions)) {
            this.addAction(key, value);
        }
    }

    private addModules(modules: Module<S, R>): void
    {
        for (const [key, value] of Object.entries(modules)) {
            this.addModule(key, value);
        }
    }
}

export default ModuleMaker
