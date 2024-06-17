import { panic } from "./stdio";

export class Option<T extends defined> {
    private inner?: T;
    constructor(value: T | undefined) {
        this.inner = value;
    }
    public is_some() {
        return this.inner !== undefined;
    }
    public is_none() {
        return this.inner === undefined;
    }
    public unwrap(): T {
        if (this.inner === undefined) {
            panic("Attempt to unwrap a None variant of an Option");
        }
        else {
            return this.inner;
        }
    }
    public expect(msg: string): T {
        if (this.inner === undefined) {
            panic(msg);
        }
        else {
            return this.inner;
        }
    }
    public unwrap_or(defaultvalue: T): T {
        if (this.inner === undefined) {
            return defaultvalue;
        }
        else {
            return this.inner;
        }
    }
    public unwrap_or_else(defaultfn: () => T): T {
        if (this.inner === undefined) {
            return defaultfn();
        }
        else {
            return this.inner;
        }
    }
    public map<R extends defined>(fn: (v: T) => R): Option<R> {
        if (this.inner === undefined) {
            return new Option(undefined) as Option<R>;
        }
        else {
            return new Option(fn(this.inner));
        }
    }
    public flatten(): T extends Option<infer I> ? Option<I> : Option<T> {
        if (this.inner !== undefined && (this.inner as any)["inner"] !== undefined) {
            return Some((this.inner as any)["inner"]) as T extends Option<infer I> ? Option<I> : Option<T>;
        }
        else {
            if (this.inner === undefined) {return None() as T extends Option<infer I> ? Option<I> : Option<T>}
            else {return Some(this.inner) as T extends Option<infer I> ? Option<I> : Option<T>}
        }
    }
    public filter(predicate: (value: T) => boolean) {
        if (this.inner !== undefined) {
            if (predicate(this.inner)) {
                return Some(this.inner);
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