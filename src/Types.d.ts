/* Types */
export type Types = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';

export type Type<T> =
    T extends 'string' ? string :
        T extends 'number' ? number :
            T extends 'boolean' ? boolean :
                T extends 'array' ? any[] :
                    T extends 'object' ? object : any;

export interface Object {
    [x: string]: any
}