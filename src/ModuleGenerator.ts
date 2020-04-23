import * as D from '~/declarations';
import ModuleUtilities from "~/ModuleUtilities";
import InstructionProcessor from "~/InstructionProcessor";

class ModuleGenerator extends ModuleUtilities {

    constructor(namespaced: boolean = true) {
        super(namespaced);
    }

    generate(template: D.Template): D.ExportModule
    {
        if (template.instructions) this.executeInstructions(template.instructions);
        if (template.state) this.addStateProperties(template.state);
        if (template.getters) this.addGetters(template.getters);
        if (template.mutations) this.addMutations(template.mutations);
        if (template.actions) this.addActions(template.actions);
        if (template.modules) this.addModules(template.modules);

        return this.module;
    }

    private executeInstructions(raw: D.Instructions): void
    {
        const processor = new InstructionProcessor(raw);
        const instructions = processor.process();

        instructions.forEach(i => {
            if (i.set_state) this.addState(i.state_name, i.state_value);
            if (i.set_getter) this.addGetter(i.getter_name, i.getter);
            if (i.set_mutation) this.addMutation(i.mutation_name, i.mutation);
        });
    }

    private addStateProperties(properties: D.Object): void
    {
        for (const [key, value] of Object.entries(properties)) {
            this.addState(key, value)
        }
    }

    private addGetters(getters: D.Getters): void
    {
        for (const [key, value] of Object.entries(getters)) {
            this.addGetter(key, value);
        }
    }

    private addMutations(mutations: D.Mutations): void
    {
        for (const [key, value] of Object.entries(mutations)) {
            this.addMutation(key, value);
        }
    }

    private addActions(actions: D.Actions): void
    {
        for (const [key, value] of Object.entries(actions)) {
            this.addAction(key, value);
        }
    }

    private addModules(modules: D.Submodules): void
    {
        for (const [key, value] of Object.entries(modules)) {
            this.addModule(key, value);
        }
    }
}

export default ModuleGenerator
