import { EnumDefPair, EnumValue, REnum } from "../renum";
import { panic } from "../stdio";

export class Option<T extends defined> implements REnum {
    _typehint!: { Some: EnumDefPair<0, T>, None: EnumDefPair<1, never> };

    public static Some: EnumValue<0> = 0;
    public static None: EnumValue<1> = 1;
    
    _innervalue!: T;
    _variant;
    constructor(value: T | undefined) {
        if (value !== undefined) {
            this._variant = Option.Some;
        }
        else {
            this._variant = Option.None;
        }
        this._innervalue = value!;
    }
    public is_some() {
        return this._innervalue !== undefined;
    }
    public is_none() {
        return this._innervalue === undefined;
    }
    public unwrap(): T {
        if (this._innervalue === undefined) {
            panic("Attempt to unwrap a None variant of an Option");
        }
        else {
            return this._innervalue;
        }
    }
    public expect(msg: string): T {
        if (this._innervalue === undefined) {
            panic(msg);
        }
        else {
            return this._innervalue;
        }
    }
    public unwrap_or(defaultvalue: T): T {
        if (this._innervalue === undefined) {
            return defaultvalue;
        }
        else {
            return this._innervalue;
        }
    }
    public unwrap_or_else(defaultfn: () => T): T {
        if (this._innervalue === undefined) {
            return defaultfn();
        }
        else {
            return this._innervalue;
        }
    }
    public map<R extends defined>(fn: (v: T) => R): Option<R> {
        if (this._innervalue === undefined) {
            return new Option(undefined) as Option<R>;
        }
        else {
            return new Option(fn(this._innervalue));
        }
    }
    public flatten(): T extends Option<infer I> ? Option<I> : Option<T> {
        if (this._innervalue !== undefined && (this._innervalue as unknown as {_innervalue: T})["_innervalue"] !== undefined) {
            return Some((this._innervalue as unknown as {_innervalue: T})["_innervalue"]) as T extends Option<infer I> ? Option<I> : Option<T>;
        }
        else {
            if (this._innervalue === undefined) {return None() as T extends Option<infer I> ? Option<I> : Option<T>}
            else {return Some(this._innervalue) as T extends Option<infer I> ? Option<I> : Option<T>}
        }
    }
    public filter(predicate: (value: T) => boolean) {
        if (this._innervalue !== undefined) {
            if (predicate(this._innervalue)) {
                return Some(this._innervalue);
            }
            else {
                return None();
            }
        }
        else {
            return None();
        }
    }
}

export function Some<T extends defined>(value: T): Option<T> {
    return new Option(value);
}

export function None(): Option<any> {
    return new Option(undefined);
}

export function Maybe<T extends defined>(val: T | undefined): Option<T> {
    if (val === undefined) return None();
    else return Some(val);
}