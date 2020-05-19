import * as D from "../types";
import ModuleUtilities from "./ModuleUtilities";
import InstructionProcessor from "./InstructionProcessor";
import {Config, Template} from "../types";

class ModuleMaker<M, Ts> extends ModuleUtilities {

    constructor(config: D.CustomConfig = {})
    {
        super(config);
    }

    make<M>(template: D.Template<Ts>): M
    {
        this.reset()

        if (template.namespaced != null) this.namespaced = template.namespaced;
        if (template.instructions) this.executeInstructions(template.instructions);
        if (template.state) this.addStateProperties(template.state);
        if (template.getters) this.addGetters(template.getters);
        if (template.mutations) this.addMutations(template.mutations);
        if (template.actions) this.addActions(template.actions);
        if (template.modules) this.addModules(template.modules);

        return this.module as any as M;
    }
    public static Make<M, Ts>(template: Template<Ts>, config?: Config): M
    {
        const maker = new ModuleMaker<M, Ts>(config);
        return maker.make(template);
    }

    private executeInstructions(raw: D.Instructions<Ts>): void
    {
        const processor = new InstructionProcessor<Ts>(raw, this.config);
        const instructions = processor.process();

        instructions.forEach((i: D.FormattedInstruction<Ts, Ts>) => {
            if (i.set_state) this.addState(i.state_name, i.state_value);
            if (i.set_getter) this.addGetter(i.getter_name, i.getter);
            if (i.set_mutation) this.addMutation(i.mutation_name, i.mutation);
        });
    }

    private addStateProperties(properties: Object | (() => {})): void
    {
        if (typeof properties === 'function') properties = properties();

        for (const [key, value] of Object.entries(properties)) {
            this.addState(key, value)
        }
    }

    private addGetters(getters: { [x:string]: ()=>any }): void
    {
        for (const [key, value] of Object.entries(getters)) {
            this.addGetter(key, value);
        }
    }

    private addMutations(mutations: { [x:string]: ()=>void }): void
    {
        for (const [key, value] of Object.entries(mutations)) {
            this.addMutation(key, value);
        }
    }

    private addActions(actions: { [x:string]: ()=>any }): void
    {
        for (const [key, value] of Object.entries(actions)) {
            this.addAction(key, value);
        }
    }

    private addModules(modules: { [x:string]: any }): void
    {
        for (const [key, value] of Object.entries(modules)) {
            this.addModule(key, ModuleMaker.Make<any, Ts>(value, this.config));
        }
    }
}

export default ModuleMaker
