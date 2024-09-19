import { EnumDefPair, EnumValue, REnum } from "../renum";
export declare class Option<T extends defined> implements REnum {
    _typehint: {
        Some: EnumDefPair<0, T>;
        None: EnumDefPair<1, never>;
    };
    static Some: EnumValue<0>;
    static None: EnumValue<1>;
    _innervalue: T;
    _variant: 0 | 1;
    constructor(value: T | undefined);
    is_some(): boolean;
    is_none(): boolean;
    unwrap(): T;
    expect(msg: string): T;
    unwrap_or(defaultvalue: T): T;
    unwrap_or_else(defaultfn: () => T): T;
    map<R extends defined>(fn: (v: T) => R): Option<R>;
    flatten(): T extends Option<infer I> ? Option<I> : Option<T>;
    filter(predicate: (value: T) => boolean): Option<T>;
}
export declare function Some<T extends defined>(value: T): Option<T>;
export declare function None(): Option<any>;
export declare function Maybe<T extends defined>(val: T | undefined): Option<T>;
