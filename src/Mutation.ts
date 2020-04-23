import * as D from "./declarations";

class Mutation {
    readonly state_name: string;

    constructor(state_name: string) {
        this.state_name = state_name
    }

    format <T extends D.Types>(type: T): D.Mutation<T>
    {
        switch (type) {
            case 'string':
                return this.stringMutation as D.Mutation<T>;
            case 'number':
                return this.numberMutation as D.Mutation<T>;
            case 'boolean':
                return this.booleanMutation as D.Mutation<T>;
            case 'object':
                return this.objectMutation as D.Mutation<T>;
            case 'array':
                return this.arrayMutation as D.Mutation<T>;
            default:
                return this.anyMutation as D.Mutation<T>;
        }
    }

    stringMutation: D.Mutation<'string'> = (state: D.Object, value?: string): void => {
        state[this.state_name] = value ? value : null
    };

    numberMutation: D.Mutation<'number'> = (state: D.Object, value?: number): void => {
        state[this.state_name] = value == null ? null : value
    };

    booleanMutation: D.Mutation<'boolean'> = (state: D.Object, value?: any): void => {
        state[this.state_name] = value == null ? null : !!value
    };

    objectMutation: D.Mutation<'object'> = (state: D.Object, value?: object): void => {
        if (value == null || Object.keys(value).length === 0) {
            state[this.state_name] = null
        } else {
            state[this.state_name] = value
        }
    };

    arrayMutation: D.Mutation<'array'> = (state: D.Object, value?: any[]): void => {
        if (value == null || value.length === 0) {
            state[this.state_name] = null
        } else {
            state[this.state_name] = value
        }
    };

    anyMutation: D.Mutation<any> = (state: D.Object, value?: any): void => {
        state[this.state_name] = value === undefined ? null : value
    }
}

export default Mutation
