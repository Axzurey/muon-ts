import { Option } from "./handle/option";
import { panic } from "./stdio"
import { IndicesOfArray, NOOP, ParseInt } from "./types";
import { create_named_symbol } from "./util";

export abstract class REnum {
    _innervalue!: any
    _typehint!: any
    _variant!: number
}
export type EnumVariantsNamed<T> = keyof ExcludeMembers<{[k in keyof T]: T[k] extends EnumValue<number> ? true : never}, never>;
export type EnumVariants<T> = T[EnumVariantsNamed<T>];
export type EnumType<T, V> = InstanceType<T> extends REnum ? InstanceType<T>['_typehint'][FindVal<InstanceType<T>['_typehint'], V>][1] : undefined;
export type EnumDefPair<I, T> = [I, T];

export type EnumValue<T extends number> = T;

type NeverAll<T> = {
    [K in keyof T]: { [P in keyof T]?: P extends K ? never : T[P] }
}[keyof T];
  
type AllowSomeButNotAll<T> = Partial<T> & NeverAll<T>;

type ArmTable<T extends REnum, U> = {[K in GetFirst<T['_typehint']>]: T['_typehint'][FindVal<T['_typehint'], K>][1] extends never ? () => U : (value: T['_typehint'][FindVal<T['_typehint'], K>][1]) => U};

type PartialArmTable<T extends REnum, U> = AllowSomeButNotAll<{[K in GetFirst<T['_typehint']>]: T['_typehint'][FindVal<T['_typehint'], K>][1] extends never ? () => U : (value: T['_typehint'][FindVal<T['_typehint'], K>][1]) => U}>

type GetFirst<T> = {[k in keyof T]: T[k] extends any[] ? T[k][0] : never}[keyof T]

export type FindVal<T, V> = Exclude<keyof T, keyof ExcludeMembers<{[k in keyof T]: T[k] extends any[] ? T[k][0] extends V ? never : 1 : 3}, never>>

type TKeyofT<T> = NOOP<T[keyof T]>;

export function match<T extends REnum, U, R = ArmTable<T, U>>(
    obj: T,
    tabl: R
): ReturnType<typeof tabl[keyof typeof tabl]>;

export function match<T extends REnum, U, V, R = PartialArmTable<T, U>>(
    obj: T,
    tabl: R,
    fallthrough: (value: TKeyofT<ExcludeMembers<{[k in keyof T['_typehint']]: T['_typehint'][k][0] extends keyof R ? never : T['_typehint'][k][1]}, never>>) => V
): ReturnType<typeof tabl[keyof typeof tabl]> | V;

export function match<V, R, X = {[k in number]: (value: number) => R}>(
    obj: number,
    tabl: X,
    fallthrough: (value: number) => V
): ReturnType<typeof tabl[keyof typeof tabl]> | V;

export function match<V, R, X = {[k: string]: (value: string) => R, [k: number]: never}>(
    obj: string,
    tabl: X,
    fallthrough: (value: string) => V
): ReturnType<typeof tabl[keyof typeof tabl]> | V;

export function match<T extends REnum, U, V, R = PartialArmTable<T, U>>(
    obj: T,
    tabl: R,
    fallthrough?: (value: T['_typehint'][Exclude<keyof T['_typehint'], keyof typeof tabl>][1]) => V
): U | V {
    if (typeIs(obj, "number")) {
        if ((tabl as Record<number, any>)[obj]) {
            return (tabl as Record<number, (val: number) => any>)[obj](obj);
        }
        else {
            assert(fallthrough !== undefined, "Fallthrough must be provided when any match arms are not covered.")
            return fallthrough!(obj);
        }
    }
    else if (typeIs(obj, "string")) {
        if ((tabl as Record<string, (val: string) => any>)[obj]) {
            return (tabl as Record<string, (val: string) => any>)[obj](obj);
        }
        else {
            assert(fallthrough !== undefined, "Fallthrough must be provided when any match arms are not covered.")
            return fallthrough!(obj);
        }
    }
    else if (obj['_variant'] !== undefined) {
        if ((tabl as {[k: typeof obj._variant]: (val: typeof obj._variant) => any})[obj._variant]) {
            return (tabl as {[k: typeof obj._variant]: (val: typeof obj._variant) => any})[obj._variant](obj._innervalue);
        }
        else {
            assert(fallthrough !== undefined, "Fallthrough must be provided when any match arms are not covered.")
            return fallthrough!(obj._variant);
        }
    }
    else {
        panic(`Object ${obj} is not allowed in a match statement`);
    }
}

type VariantListToTypehint<T extends readonly (readonly [string, any])[]> = {[k in IndicesOfArray<T> as T[k][0]]: EnumDefPair<k, ReturnType<T[k][1]>>};

/**
 * This function signature is used as a type for the create_enum function. (please don't call this)
 * @returns "T" but it panics when you call it 😄 (don't call it I beg of you)
 */
export function ENode<T>(): T {
    panic("Please do not call the ENode function. Thank you.");
}

type TupleToIndexedObject<T extends ReadonlyArray<readonly [string, unknown]>> = {
    [K in T[number][0]]: {
        [I in keyof T]: T[I] extends readonly [K, unknown] 
            ? I extends `${number}` 
                ? ParseInt<I>
                : never 
            : never
    }[number];
};

export type VariantOf<T extends {['_typehint']: any}> = TKeyofT<{[k in keyof T['_typehint']]: T['_typehint'][k][0]}>

export function create_enum<X extends string, T extends readonly (readonly [X, U])[], U>(variants: T) {
    let enumclass = class extends REnum {
        declare _typehint: VariantListToTypehint<typeof variants>;

        _innervalue: ReturnType<U>;
        _variant;

        constructor(variant: number, inner: ReturnType<U>) {
            super()
            this._variant = variant;
            this._innervalue = inner;
        }
        static create<R extends IndicesOfArray<typeof variants>>(variant: R, value: ReturnType<typeof variants[typeof variant][1]>) {
            return new this(variant, value);
        }
    }

    for (let i = 0; i < variants.size(); i++) {
        //we're going to put the enum name as a static member of the class at runtime, with it's value being it's variant
        (enumclass as unknown as {[k: string]: number})[variants[i][0]] = i;
    }
    //incase i need this later {[K in typeof variants[number][0]]: ReturnType<Extract<typeof variants[number], [K, any]>[1]>};
    return enumclass as (typeof enumclass) & TupleToIndexedObject<typeof variants> & {['_typehint']: VariantListToTypehint<typeof variants>};
}