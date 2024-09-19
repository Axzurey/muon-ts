import { Option, Maybe } from "../handle/option";
import { Err, Ok, Result } from "../handle/result";
import { EnumDefPair, EnumType, EnumValue, EnumVariants, REnum } from "../renum";
import { panic } from "../stdio";
import { RIterator } from "./RIterator";

export class VecErr extends REnum {
    declare _typehint: {Frozen: EnumDefPair<0, string>, OutOfBounds: EnumDefPair<1, string>};

    public static Frozen: EnumValue<0> = 0;
    public static OutOfBounds: EnumValue<1> = 1;
    
    _innervalue: number | string | boolean;
    _variant;

    constructor(variant: number, inner: number | string | boolean) {
        super()
        this._variant = variant;
        this._innervalue = inner;
    }
    static create<T extends EnumVariants<typeof VecErr>>(variant: T, value: EnumType<typeof VecErr, typeof variant>) {
        return new this(variant, value);
    }
}

export class Vec<T extends defined> {
    
    private values: T[];
    private frozen: boolean = false;

    constructor(init?: T[]) {
        this.values = init === undefined ? [] : init;
    }
    static with_capacity<T extends defined>(size: number): Vec<T> {
        return new Vec(table.create(size));
    }
    iter(): RIterator<T> {

        return new RIterator(this);
    }
    freeze() {
        table.freeze(this.values);
        this.frozen = true;
    }
    is_frozen(): boolean {
        return this.frozen;
    }
    /**
     * moves all elements from other into self. At the end of the operation, other will be empty
     */
    append(other: Vec<T>) {
        if (this.is_frozen()) return Err(VecErr.create(VecErr.Frozen, "Vec has already been frozen"));
        while (true) {
            let res = other.pop().unwrap();
            if (res.is_none()) break;
            this.push(res.unwrap());
        }
    }
    is_empty(): boolean {
        return this.len() === 0;
    }
    split_off(at: number): Result<Vec<T>, VecErr> {
        if (this.is_frozen()) return Err(VecErr.create(VecErr.Frozen, "Vec has already been frozen"));
        if (at > this.len() || at < 0) panic(`Attempt to split UVec at ${at} when length is ${this.len()}`);

        let data: T[] = [];
        for (let i = this.len() - 1; i >= at; i--) {
            data[i - at] = this.pop().unwrap().unwrap();
        }

        return Ok(new Vec(data));
    }
    len(): number {
        return this.values.size();
    }
    clear(): Result<0, VecErr> {
        if (this.is_frozen()) return Err(VecErr.create(VecErr.Frozen, "Vec has already been frozen"));
        this.values.clear();

        return Ok(0);
    }
    push(val: T): Result<0, VecErr> {
        if (this.is_frozen()) return Err(VecErr.create(VecErr.Frozen, "Vec has already been frozen"));
        this.values.push(val);
        return Ok(0)
    }
    insert(val: T, index: number): Result<0, VecErr> {
        if (this.is_frozen()) return Err(VecErr.create(VecErr.Frozen, "Vec has already been frozen"));
        if (index > this.len() || index < 0) return Err(VecErr.create(VecErr.OutOfBounds, `Index ${index} is greater than length of the UVec(${this.len()}) or less than 0.`));

        this.values.insert(index, val);
        return Ok(0)
    }
    index(v: T): Option<number> {
        return Maybe(this.values.indexOf(v));
    }
    remove(index: number): Result<Option<T>, VecErr> {
        if (this.is_frozen()) return Err(VecErr.create(VecErr.Frozen, "Vec has already been frozen"));
        return Ok(Maybe(this.values.remove(index)));
    }
    remove_swap(index: number): Result<Option<T>, VecErr> {
        if (this.is_frozen()) return Err(VecErr.create(VecErr.Frozen, "Vec has already been frozen"));
        return Ok(Maybe(this.values.unorderedRemove(index)));
    }
    pop(): Result<Option<T>, VecErr> {
        if (this.is_frozen()) return Err(VecErr.create(VecErr.Frozen, "Vec has already been frozen"));
        return Ok(Maybe(this.values.pop()));
    }
    foreach(callback: (val: T) => any) {
        this.values.forEach(callback);
    }
    map<R extends defined>(transform: (val: T, index: number) => R): Result<Vec<R>, VecErr> {
        if (this.is_frozen()) return Err(VecErr.create(VecErr.Frozen, "Vec has already been frozen"));
        return Ok(new Vec(this.values.map(transform)));
    }
    first(): Option<T> {
        return Maybe(this.values[0]);
    }
    last(): Option<T> {
        return Maybe(this.values[this.len() - 1]);
    }
    get(index: number): Option<T> {
        return Maybe(this.values[index]);
    }
    reverse(): Result<0, VecErr> {
        if (this.is_frozen()) return Err(VecErr.create(VecErr.Frozen, "Vec has already been frozen"));
        let len = this.len();
        let flen = math.floor(len / 2);
        for (let i = 0; i < flen; i++) {
            let x = this.values[i];
            let y = this.values[len - i - 1];
            this.values[i] = y;
            this.values[len - i - 1] = x;
        }
        return Ok(0)
    }
}
