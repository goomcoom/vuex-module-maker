import * as D from '~/declarations';
import ModuleUtilities from "~/ModuleUtilities";
import InstructionProcessor from "~/InstructionProcessor";

class ModuleGenerator extends ModuleUtilities {

    constructor(namespaced: boolean = true) {
        super(namespaced);
    }

    generate(raw_module: D.RawModule): D.ExportModule
    {
        if (raw_module.instruction) {
            this.executeInstructions(raw_module.instruction);
        }
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
}

export default ModuleGenerator
