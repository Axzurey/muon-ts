import { IndicesOfArray, NOOP, ParseInt } from "./types";
export declare abstract class REnum {
    _innervalue: any;
    _typehint: any;
    _variant: number;
}
export type EnumVariantsNamed<T> = keyof ExcludeMembers<{
    [k in keyof T]: T[k] extends EnumValue<number> ? true : never;
}, never>;
export type EnumVariants<T> = T[EnumVariantsNamed<T>];
export type EnumType<T, V> = InstanceType<T> extends REnum ? InstanceType<T>['_typehint'][FindVal<InstanceType<T>['_typehint'], V>][1] : undefined;
export type EnumDefPair<I, T> = [I, T];
export type EnumValue<T extends number> = T;
type NeverAll<T> = {
    [K in keyof T]: {
        [P in keyof T]?: P extends K ? never : T[P];
    };
}[keyof T];
type AllowSomeButNotAll<T> = Partial<T> & NeverAll<T>;
type ArmTable<T extends REnum, U> = {
    [K in GetFirst<T['_typehint']>]: T['_typehint'][FindVal<T['_typehint'], K>][1] extends never ? () => U : (value: T['_typehint'][FindVal<T['_typehint'], K>][1]) => U;
};
type PartialArmTable<T extends REnum, U> = AllowSomeButNotAll<{
    [K in GetFirst<T['_typehint']>]: T['_typehint'][FindVal<T['_typehint'], K>][1] extends never ? () => U : (value: T['_typehint'][FindVal<T['_typehint'], K>][1]) => U;
}>;
type GetFirst<T> = {
    [k in keyof T]: T[k] extends any[] ? T[k][0] : never;
}[keyof T];
export type FindVal<T, V> = Exclude<keyof T, keyof ExcludeMembers<{
    [k in keyof T]: T[k] extends any[] ? T[k][0] extends V ? never : 1 : 3;
}, never>>;
type TKeyofT<T> = NOOP<T[keyof T]>;
export declare function match<T extends REnum, U, R = ArmTable<T, U>>(obj: T, tabl: R): ReturnType<typeof tabl[keyof typeof tabl]>;
export declare function match<T extends REnum, U, V, R = PartialArmTable<T, U>>(obj: T, tabl: R, fallthrough: (value: TKeyofT<ExcludeMembers<{
    [k in keyof T['_typehint']]: T['_typehint'][k][0] extends keyof R ? never : T['_typehint'][k][1];
}, never>>) => V): ReturnType<typeof tabl[keyof typeof tabl]> | V;
export declare function match<V, R, X = {
    [k in number]: (value: number) => R;
}>(obj: number, tabl: X, fallthrough: (value: number) => V): ReturnType<typeof tabl[keyof typeof tabl]> | V;
export declare function match<V, R, X = {
    [k: string]: (value: string) => R;
    [k: number]: never;
}>(obj: string, tabl: X, fallthrough: (value: string) => V): ReturnType<typeof tabl[keyof typeof tabl]> | V;
type VariantListToTypehint<T extends readonly (readonly [string, any])[]> = {
    [k in IndicesOfArray<T> as T[k][0]]: EnumDefPair<k, ReturnType<T[k][1]>>;
};
/**
 * This function signature is used as a type for the create_enum function. (please don't call this)
 * @returns "T" but it panics when you call it 😄 (don't call it I beg of you)
 */
export declare function ENode<T>(): T;
type TupleToIndexedObject<T extends ReadonlyArray<readonly [string, unknown]>> = {
    [K in T[number][0]]: {
        [I in keyof T]: T[I] extends readonly [K, unknown] ? I extends `${number}` ? ParseInt<I> : never : never;
    }[number];
};
export type VariantOf<T extends {
    ['_typehint']: any;
}> = TKeyofT<{
    [k in keyof T['_typehint']]: T['_typehint'][k][0];
}>;
export declare function create_enum<X extends string, T extends readonly (readonly [X, U])[], U>(variants: T): ({
    new (variant: number, inner: ReturnType<U>): {
        _typehint: VariantListToTypehint<typeof variants>;
        _innervalue: ReturnType<U>;
        _variant: number;
    };
    create<R extends IndicesOfArray<typeof variants>>(variant: R, value: ReturnType<(typeof variants)[typeof variant][1]>): {
        _typehint: VariantListToTypehint<typeof variants>;
        _innervalue: ReturnType<U>;
        _variant: number;
    };
}) & TupleToIndexedObject<typeof variants> & {};
export {};
