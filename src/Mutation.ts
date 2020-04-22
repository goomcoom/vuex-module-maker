import * as D from "../index";

class Mutation {
    readonly state_name: string;

    constructor(state_name: string) {
        this.state_name = state_name
    }

    format <T extends D.Types>(type: T): D.Mutation<T>
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

    stringMutation: D.Mutation<'string'> = (state: {[x: string]: any}, value?: string): void => {
        state[this.state_name] = value ? value : null
    };

    numberMutation: D.Mutation<'number'> = (state: {[x: string]: any}, value?: number): void => {
        state[this.state_name] = value == null ? null : value
    };

    booleanMutation: D.Mutation<'boolean'> = (state: {[x: string]: any}, value?: any): void => {
        state[this.state_name] = value == null ? null : !!value
    };

    objectMutation: D.Mutation<'object'> = (state: {[x: string]: any}, value?: object): void => {
        if (value == null || Object.keys(value).length === 0) {
            state[this.state_name] = null
        } else {
            state[this.state_name] = value
        }
    };

    arrayMutation: D.Mutation<'array'> = (state: {[x: string]: any}, value?: any[]): void => {
        if (value == null || value.length === 0) {
            state[this.state_name] = null
        } else {
            state[this.state_name] = value
        }
    };

    anyMutation: D.Mutation<any> = (state: {[x: string]: any}, value?: any): void => {
        state[this.state_name] = value === undefined ? null : value
    }
}

export default Mutation
