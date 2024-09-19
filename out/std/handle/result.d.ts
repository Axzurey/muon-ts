import { EnumDefPair, EnumValue, REnum } from "../renum";
export declare class Result<T extends defined, E extends defined> implements REnum {
    _typehint: {
        Ok: EnumDefPair<0, T>;
        Err: EnumDefPair<1, E>;
    };
    static Ok: EnumValue<0>;
    static Err: EnumValue<1>;
    _innervalue: T | E;
    _variant: 0 | 1;
    constructor(value: T | E, variant: number);
    unwrap(): T;
    is_ok(): boolean;
    is_err(): boolean;
}
export declare function Ok<T extends defined>(value: T): Result<T, any>;
export declare function Err<E extends defined>(err: E): Result<any, E>;
