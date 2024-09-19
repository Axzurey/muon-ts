import { Option } from "../handle/option";
import { Result } from "../handle/result";
import { EnumDefPair, EnumType, EnumValue, EnumVariants, REnum } from "../renum";
import { RIterator } from "./RIterator";
export declare class VecErr extends REnum {
    _typehint: {
        Frozen: EnumDefPair<0, string>;
        OutOfBounds: EnumDefPair<1, string>;
    };
    static Frozen: EnumValue<0>;
    static OutOfBounds: EnumValue<1>;
    _innervalue: number | string | boolean;
    _variant: number;
    constructor(variant: number, inner: number | string | boolean);
    static create<T extends EnumVariants<typeof VecErr>>(variant: T, value: EnumType<typeof VecErr, typeof variant>): VecErr;
}
export declare class Vec<T extends defined> {
    private values;
    private frozen;
    constructor(init?: T[]);
    static with_capacity<T extends defined>(size: number): Vec<T>;
    iter(): RIterator<T>;
    freeze(): void;
    is_frozen(): boolean;
    /**
     * moves all elements from other into self. At the end of the operation, other will be empty
     */
    append(other: Vec<T>): Result<any, VecErr> | undefined;
    is_empty(): boolean;
    split_off(at: number): Result<Vec<T>, VecErr>;
    len(): number;
    clear(): Result<0, VecErr>;
    push(val: T): Result<0, VecErr>;
    insert(val: T, index: number): Result<0, VecErr>;
    index(v: T): Option<number>;
    remove(index: number): Result<Option<T>, VecErr>;
    remove_swap(index: number): Result<Option<T>, VecErr>;
    pop(): Result<Option<T>, VecErr>;
    foreach(callback: (val: T) => any): void;
    map<R extends defined>(transform: (val: T, index: number) => R): Result<Vec<R>, VecErr>;
    first(): Option<T>;
    last(): Option<T>;
    get(index: number): Option<T>;
    reverse(): Result<0, VecErr>;
}
