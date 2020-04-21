class Getter {
    readonly type: 'string'|'number'|'boolean'|'object'|'array'|'any';
    readonly state_name: string;
    private default_value: any;

    constructor (
        type: 'string'|'number'|'boolean'|'object'|'array'|'any',
        state_name: string,
        default_value: any = undefined
    ) {
        this.type = type;
        this.state_name = state_name;
        this.setDefaultValue(default_value)
    }

    setDefaultValue(value: any): void {
        if (value !== undefined ) {
            this.default_value = value
        } else {
            switch (this.type) {
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

    format(): (state: { [x: string]: any; }) => any
    {
        return (state: { [x: string]: any; }): any => {
            return state[this.state_name] ? state[this.state_name] : this.default_value
        };
    }
}

export default Getter
