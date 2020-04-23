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

    private addStateProperties(properties: Object): void
    {
        for (const [key, value] of Object.entries(properties)) {
            this.addState(key, value)
        }
    }
}

export default ModuleGenerator
