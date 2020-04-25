// @ts-ignore
import Form from 'vform'
import * as D from "../types/index";
import { Mutation as VMutation } from "vuex";

class Mutation<S> {
    readonly state_name: string;

    constructor(state_name: string) {
        this.state_name = state_name
    }

    format <T extends D.Types>(type: T): VMutation<S>
    {
        switch (type) {
            case 'string':
                return this.stringMutation as VMutation<S>;
            case 'number':
                return this.numberMutation as VMutation<S>;
            case 'boolean':
                return this.booleanMutation as VMutation<S>;
            case 'object':
                return this.objectMutation as VMutation<S>;
            case 'array':
                return this.arrayMutation as VMutation<S>;
            case 'form':
                return this.formMutation as VMutation<S>;
            default:
                return this.anyMutation as VMutation<S>;
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

    formMutation: D.FormMutation = <S>(state: S, value?: D.Object): void => {
        if (value == null || Object.keys(value).length === 0) {
            // @ts-ignore
            state[this.state_name] = null
        } else {
            // @ts-ignore
            state[this.state_name] = new Form(value)
        }
    };

    anyMutation: D.AnyMutation = <S>(state: S, value?: any): void => {
        // @ts-ignore
        state[this.state_name] = value === undefined ? null : value
    }
}

export default Mutation
