// @ts-ignore
import Form from 'vform'
import * as D from "../types";
import { Mutation as VMutation } from "vuex";

class Mutation<S> {
    readonly state_name: string;

    constructor(state_name: string) {
        this.state_name = state_name
    }

    format <T extends D.Types>(type: T): VMutation<S>
    {
        return <S>(state: S, value?: D.Type<T>): void => {
            // @ts-ignore
            state[this.state_name] = (value == null) ? null : value;
        };
    }
}

export default Mutation
