import {Types} from "~/Types.d.ts";
import * as D from "~/Getter.d.ts";
import {Getter as VGetter} from "vuex";

class Getter<S, R> {
    readonly state_name: string;
    private default_value: any;
    readonly default_getter: VGetter<S, R> = <S>(state: S): any => {
        // @ts-ignore
        return state[this.state_name] == null ? this.default_value : state[this.state_name];
    };

    constructor (state_name: string, default_value: any = undefined) {
        this.state_name = state_name;
        this.default_value = default_value;
    }

    setDefaultValue(type: Types): void {
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

    format  <T extends Types> (type: T): VGetter<S, R>
    {
        this.setDefaultValue(type);

        // return this.default_getter as VGetter<S, R>;

        switch (type) {
            case 'string':
                return this.stringGetter as VGetter<S, R>;
            case 'number':
                return this.numberGetter as VGetter<S, R>;
            case 'boolean':
                return this.booleanGetter as VGetter<S, R>;
            case 'array':
                return this.arrayGetter as VGetter<S, R>;
            case 'object':
                return this.objectGetter as VGetter<S, R>;
            default:
                return this.anyGetter as VGetter<S, R>;
        }
    }

    // @ts-ignore
    stringGetter = <S>(state: S, getters: any = {}, rootState: R = {}, rootGetters: any =  {}): string => {
        // @ts-ignore
        return state[this.state_name] == null ? this.default_value : state[this.state_name];
    };

    // @ts-ignore
    numberGetter: D.NumberGetter = (state, getters: any = {}, rootState: R = {}, rootGetters: any =  {}): number|null => {
        // @ts-ignore
        return state[this.state_name] == null ? this.default_value : state[this.state_name];
    };
    // @ts-ignore
    booleanGetter: D.BooleanGetter = (state, getters: any = {}, rootState: R = {}, rootGetters: any =  {}): boolean => {
        // @ts-ignore
        return state[this.state_name] == null ? this.default_value : state[this.state_name];
    };
    // @ts-ignore
    arrayGetter: D.ArrayGetter = (state, getters: any = {}, rootState: R = {}, rootGetters: any =  {}): any[] => {
        // @ts-ignore
        return state[this.state_name] == null ? this.default_value : state[this.state_name];
    };
    // @ts-ignore
    objectGetter: D.ObjectGetter = (state, getters: any = {}, rootState: R = {}, rootGetters: any =  {}): object|null => {
        // @ts-ignore
        return state[this.state_name] == null ? this.default_value : state[this.state_name];
    };
    // @ts-ignore
    anyGetter: D.AnyGetter = (state, getters: any = {}, rootState: R = {}, rootGetters: any =  {}): any => {
        // @ts-ignore
        return state[this.state_name] == null ? this.default_value : state[this.state_name]
    }
}

export default Getter
