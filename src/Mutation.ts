import * as D from "../types/index";

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

    stringMutation: D.StringMutation = <S>(state: S, value?: string): void => {
        // @ts-ignore
        state[this.state_name] = value ? value : null
    };

    numberMutation: D.NumberMutation = <S>(state: S, value?: number): void => {
        // @ts-ignore
        state[this.state_name] = value == null ? null : value
    };

    booleanMutation: D.BooleanMutation = <S>(state: S, value?: any): void => {
        // @ts-ignore
        state[this.state_name] = value == null ? null : !!value
    };

    objectMutation: D.ObjectMutation = <S>(state: S, value?: object): void => {
        if (value == null || Object.keys(value).length === 0) {
            // @ts-ignore
            state[this.state_name] = null
        } else {
            // @ts-ignore
            state[this.state_name] = value
        }
    };

    arrayMutation: D.ArrayMutation = <S>(state: S, value?: any[]): void => {
        if (value == null || value.length === 0) {
            // @ts-ignore
            state[this.state_name] = null
        } else {
            // @ts-ignore
            state[this.state_name] = value
        }
    };

    anyMutation: D.AnyMutation = <S>(state: S, value?: any): void => {
        // @ts-ignore
        state[this.state_name] = value === undefined ? null : value
    }
}

export default Mutation
