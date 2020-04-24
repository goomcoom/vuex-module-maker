import {Types} from '~/Types.d'

/* Getters */
export type StringGetter = <S>(state: S) => string;
export type NumberGetter = <S>(state: S) => number|null;
export type BooleanGetter = <S>(state: S) => boolean;
export type ArrayGetter = <S>(state: S) => any[];
export type ObjectGetter = <S>(state: S) => object|null;
export type AnyGetter = <S>(state: S) => any;

export type Getter<T> =
    T extends 'string' ? StringGetter :
        T extends 'number' ? NumberGetter :
            T extends 'boolean' ? BooleanGetter :
                T extends 'array' ? ArrayGetter :
                    T extends 'object' ? ObjectGetter : AnyGetter;

export interface Getters {
    [x: string]: Getter<Types>
}
