import ModuleUtilities from "~/ModuleUtilities";
import * as D from '~/declarations'
import InstructionProcessor from "~/InstructionProcessor";

class ModuleGenerator extends ModuleUtilities {

    constructor(namespaced: boolean = true) {
        super(namespaced);
    }

    generate(raw_module: D.RawModule): D.ExportModule
    {
        if (raw_module.instruction) {
            const processor = new InstructionProcessor(raw_module.instruction);
            const instructions = processor.process();
            this.executeInstructions(instructions);
        }
        return this.module
    }

    private executeInstructions(instructions: D.FormattedInstructions): void
    {
        instructions.forEach(i => {
            if (i.set_state) this.state[i.state_name] = i.state_value;
            if (i.set_getter) this.getters[i.getter_name] = i.getter;
        })
    }
}


export default ModuleGenerator
