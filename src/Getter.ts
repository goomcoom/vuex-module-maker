import * as D from "../types/index";
import { Getter as VGetter } from "vuex";

class Getter<S, R> {
    readonly state_name: string;
    private default_value: any;

    constructor (state_name: string, default_value: any = undefined) {
        this.state_name = state_name;
        this.default_value = default_value;
    }

    setDefaultValue(type: D.Types): void {
        if (this.default_value === undefined ) {
            switch (type) {
                case 'string':
                    this.default_value = '';
                    break;
                case 'number':
                    this.default_value =  0;
                    break;
                case 'boolean':
                    this.default_value =  false;
                    break;
                case 'object':
                    this.default_value =  {};
                    break;
                case 'array':
                    this.default_value =  [];
                    break;
                default:
                    this.default_value =  null
            }
        }
    }

    format  <T extends D.Types> (type: T): VGetter<S, R>
    {
        this.setDefaultValue(type);

        return <T, S>(state: S): D.Type<T> => {
            // @ts-ignore
            return state[this.state_name] == null ? this.default_value : state[this.state_name];
        };
    }
}

export default Getter
