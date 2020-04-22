import ModuleUtilities from "~/ModuleUtilities";
import * as D from '~/declarations'

class ModuleGenerator extends ModuleUtilities {

    constructor(namespaced: boolean = true) {
        super(namespaced);
    }

    generate(raw_module: D.RawModule): D.ExportModule
    {
        return this.module
    }
}


export default ModuleGenerator
