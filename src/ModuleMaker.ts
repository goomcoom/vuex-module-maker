import ModuleUtilities from "./ModuleUtilities";
import InstructionProcessor from "./InstructionProcessor";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex"
import {Instructions, Template, CustomConfig} from "../types";

class ModuleMaker<S, R> extends ModuleUtilities<S, R> {

    constructor(config: CustomConfig<S, R> = {}) {
        super(config);
    }

    make(template: Template<S, R>): Module<S, R>
    {
        if (template.instructions) this.executeInstructions(template.instructions);
        if (template.state) this.addStateProperties(template.state);
        if (template.getters) this.addGetters(template.getters);
        if (template.mutations) this.addMutations(template.mutations);
        if (template.actions) this.addActions(template.actions);
        if (template.modules) this.addModules(template.modules);

        return this.module;
    }

    private executeInstructions(raw: Instructions<S, R>): void
    {
        const processor = new InstructionProcessor(raw);
        const instructions = processor.process();

        instructions.forEach(i => {
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
