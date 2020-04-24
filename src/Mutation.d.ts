import { Types } from "~/Types.d";

/* Mutations */
export type StringMutation = <S>(state: S, value?: string ) => void;
export type NumberMutation = <S>(state: S, value?: number ) => void;
export type BooleanMutation = <S>(state: S, value?: boolean ) => void;
export type ArrayMutation = <S>(state: S, value?: any[] ) => void;
export type ObjectMutation = <S>(state: S, value?: object ) => void;
export type AnyMutation = <S>(state: S, value?: any ) => void;

export type Mutation<T> =
    T extends 'string' ? StringMutation :
        T extends 'number' ? NumberMutation :
            T extends 'boolean' ? BooleanMutation :
                T extends 'array' ? ArrayMutation :
                    T extends 'object' ? ObjectMutation : AnyMutation;

export interface Mutations {
    [x: string]: Mutation<Types>
}
