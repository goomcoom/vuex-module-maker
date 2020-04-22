type MutationType<T> =
    T extends 'string' ? (state: {[x: string]: any}, value?: string ) => void :
        T extends 'number' ? (state: {[x: string]: any}, value?: number ) => void :
            T extends 'boolean' ? (state: {[x: string]: any}, value?: boolean ) => void :
                T extends 'array' ? (state: {[x: string]: any}, value?: any[] ) => void :
                    T extends 'object' ? (state: {[x: string]: any}, value?: object ) => void :
                        (state: {[x: string]: any}, value?: any ) => void;

type AllowedTypes = 'string'|'number'|'boolean'|'object'|'array'|'any';

class Mutation {
    readonly state_name: string;

    constructor(state_name: string) {
        this.state_name = state_name
    }

    format <T extends AllowedTypes>(type: T): MutationType<T>
    {
        switch (type) {
            case 'string':
                // @ts-ignore
                return this.stringMutation;
            case 'number':
                // @ts-ignore
                return this.numberMutation;
            case 'boolean':
                // @ts-ignore
                return this.booleanMutation;
            case 'object':
                // @ts-ignore
                return this.objectMutation;
            case 'array':
                // @ts-ignore
                return this.arrayMutation;
            default:
                // @ts-ignore
                return this.anyMutation
        }
    }

    stringMutation: MutationType<'string'> = (state: {[x: string]: any}, value?: string): void => {
        state[this.state_name] = value ? value : null
    };

    numberMutation: MutationType<'number'> = (state: {[x: string]: any}, value?: number): void => {
        state[this.state_name] = value == null ? null : value
    };

    booleanMutation: MutationType<'boolean'> = (state: {[x: string]: any}, value?: any): void => {
        state[this.state_name] = value == null ? null : !!value
    };

    objectMutation: MutationType<'object'> = (state: {[x: string]: any}, value?: object): void => {
        if (value == null || Object.keys(value).length === 0) {
            state[this.state_name] = null
        } else {
            state[this.state_name] = value
        }
    };

    arrayMutation: MutationType<'array'> = (state: {[x: string]: any}, value?: any[]): void => {
        if (value == null || value.length === 0) {
            state[this.state_name] = null
        } else {
            state[this.state_name] = value
        }
    };

    anyMutation: MutationType<any> = (state: {[x: string]: any}, value?: any): void => {
        state[this.state_name] = value === undefined ? null : value
    }
}

export default Mutation
