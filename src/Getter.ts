import * as D from "../index";

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
                // @ts-ignore
                return this.stringGetter;
            case 'number':
                // @ts-ignore
                return this.numberGetter;
            case 'boolean':
                // @ts-ignore
                return this.booleanGetter;
            case 'array':
                // @ts-ignore
                return this.arrayGetter;
            case 'object':
                // @ts-ignore
                return this.objectGetter;
            default:
                // @ts-ignore
                return this.anyGetter;
        }
    }

    stringGetter: D.Getter<'string'> = (state: { [x: string]: any; }): string => {
        return state[this.state_name] ? state[this.state_name] : this.default_value
    };

    numberGetter: D.Getter<'number'> = (state: { [x: string]: any; }): number|null => {
        return state[this.state_name] ? state[this.state_name] : this.default_value
    };

    booleanGetter: D.Getter<'boolean'> = (state: { [x: string]: any; }): boolean => {
        return state[this.state_name] ? state[this.state_name] : this.default_value
    };

    arrayGetter: D.Getter<'array'> = (state: { [x: string]: any; }): any[] => {
        return state[this.state_name] ? state[this.state_name] : this.default_value
    };

    objectGetter: D.Getter<'object'> = (state: { [x: string]: any; }): object|null => {
        return state[this.state_name] ? state[this.state_name] : this.default_value
    };

    anyGetter: D.Getter<'any'> = (state: { [x: string]: any; }): any => {
        return state[this.state_name] ? state[this.state_name] : this.default_value
    }
}

export default Getter
