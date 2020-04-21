class Mutation {
    readonly type: 'string'|'number'|'boolean'|'object'|'array'|'any';
    readonly state_name: string;

    constructor(type: 'string'|'number'|'boolean'|'object'|'array'|'any', state_name: string) {
        this.type = type;
        this.state_name = state_name
    }

    format():
        ((state: {[x: string]: any}, value?: string ) => void) |
        ((state: {[x: string]: any}, value?: number ) => void) |
        ((state: {[x: string]: any}, value?: object ) => void) |
        ((state: {[x: string]: any}, value?: any[] ) => void) |
        ((state: {[x: string]: any}, value?: any ) => void)
    {
        switch (this.type) {
            case 'string':
                return this.stringMutation;
            case 'number':
                return this.numberMutation;
            case 'boolean':
                return this.booleanMutation;
            case 'object':
                return this.objectMutation;
            case 'array':
                return this.arrayMutation;
            default:
                return this.anyMutation
        }
    }

    stringMutation = (state: {[x: string]: any}, value?: string): void => {
        state[this.state_name] = value ? value : null
    };

    numberMutation = (state: {[x: string]: any}, value?: number): void => {
        state[this.state_name] = value == null ? null : value
    };

    booleanMutation = (state: {[x: string]: any}, value?: any): void => {
        state[this.state_name] = value == null ? null : !!value
    };

    objectMutation = (state: {[x: string]: any}, value?: object): void => {
        if (value == null || Object.keys(value).length === 0) {
            state[this.state_name] = null
        } else {
            state[this.state_name] = value
        }
    };

    arrayMutation = (state: {[x: string]: any}, value?: any[]): void => {
        if (value == null || value.length === 0) {
            state[this.state_name] = null
        } else {
            state[this.state_name] = value
        }
    };

    anyMutation = (state: {[x: string]: any}, value?: any): void => {
        state[this.state_name] = value === undefined ? null : value
    }
}

export default Mutation
