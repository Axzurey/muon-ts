import { EnumDefPair, EnumValue, REnum } from "../renum";
import { panic } from "../stdio";

export class Result<T extends defined, E extends defined> implements REnum {
    _typehint!: {Ok: EnumDefPair<0, T>, Err: EnumDefPair<1, E>};

    public static Ok: EnumValue<0> = 0;
    public static Err: EnumValue<1> = 1;
    
    _innervalue: T | E;
    _variant;
    
    constructor(value: T | E, variant: number) {
        if (variant === Result.Ok) {
            this._variant = Result.Ok;
        }
        else if (variant === Result.Err) {
            this._variant = Result.Err;
        }
        else {
            panic("Invalid Result variant");
        }
        this._innervalue = value;
    }
    public unwrap(): T {
        if (this.is_err()) {
            panic("Attempt to unwrap an Err variant of a Result");
        }
        else {
            return this._innervalue as T;
        }
    }
    is_ok(): boolean {
        if (this._variant === Result.Ok) return true;
        return false;
    }

    is_err(): boolean {
        if (this._variant === Result.Err) return true;
        return false;
    }
}

export function Ok<T extends defined>(value: T): Result<T, any> {
    return new Result(value, Result.Ok);
}

export function Err<E extends defined>(err: E): Result<any, E> {
    return new Result(err, Result.Err);
}