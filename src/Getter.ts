import * as D from "./declarations";

class Getter {
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
                    this.default_value =  null;
                    break;
                case 'boolean':
                    this.default_value =  false;
                    break;
                case 'object':
                    this.default_value =  null;
                    break;
                case 'array':
                    this.default_value =  [];
                    break;
                default:
                    this.default_value =  null
            }
        }
    }

    format  <T extends D.Types> (type: D.Type<T>): D.Getter<T>
    {
        this.setDefaultValue(type);

        switch (type) {
            case 'string':
                return this.stringGetter as D.Getter<T>;
            case 'number':
                return this.numberGetter as D.Getter<T>;
            case 'boolean':
                return this.booleanGetter as D.Getter<T>;
            case 'array':
                return this.arrayGetter as D.Getter<T>;
            case 'object':
                return this.objectGetter as D.Getter<T>;
            default:
                return this.anyGetter as D.Getter<T>;
        }
    }

    stringGetter: D.Getter<'string'> = (state: D.Object): string => {
        return state[this.state_name] == null ? this.default_value : state[this.state_name];
    };

    numberGetter: D.Getter<'number'> = (state: D.Object): number|null => {
        return state[this.state_name] == null ? this.default_value : state[this.state_name];
    };

    booleanGetter: D.Getter<'boolean'> = (state: D.Object): boolean => {
        return state[this.state_name] == null ? this.default_value : state[this.state_name];
    };

    arrayGetter: D.Getter<'array'> = (state: D.Object): any[] => {
        return state[this.state_name] == null ? this.default_value : state[this.state_name];
    };

    objectGetter: D.Getter<'object'> = (state: D.Object): object|null => {
        return state[this.state_name] == null ? this.default_value : state[this.state_name];
    };

    anyGetter: D.Getter<'any'> = (state: D.Object): any => {
        return state[this.state_name] == null ? this.default_value : state[this.state_name]
    }
}

export default Getter
