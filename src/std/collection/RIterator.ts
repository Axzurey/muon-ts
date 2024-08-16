import { MappedIterator } from "../adapters/MappedIterator";
import { None, Option } from "../handle/option";
import { Err, Ok, Result } from "../handle/result";
import { UInt } from "../types";
import { Vec } from "./vec";

export class RIterator<T extends defined> {

    next_index: UInt = 0;

    constructor(private collection: Vec<T>) {
        table.freeze(collection);
    }

    next(): Option<T> {
        let value = this.collection.get(this.next_index);

        if (value.is_some()) {
            this.next_index ++;
        }

        return value;
    }

    count(): UInt {
        let count = 0;
        while (true) {
            let value = this.next();

            if (value.is_none()) break;

            count ++;
        }
        return count;
    }

    last(): Option<T> {
        let previous = this.next();
        if (previous.is_none()) return previous;
        while (true) {
            let current = this.next();
            if (current.is_none()) return previous;

            previous = current;
        }
    }

    advance_by(by: UInt): Result<0, UInt> {
        for (let i = 0; i < by; i++) {
            if (this.next().is_none()) return Err(by - i);
        }
        return Ok(0)
    }

    nth(n: UInt) {
        if (this.advance_by(n).is_err()) return None();
        return this.next();
    }

    map<U extends defined>(fn: (item: T) => U): MappedIterator<U, T, typeof this> & RIterator<U> {
        return new MappedIterator(this, fn) as MappedIterator<U, T, typeof this> & RIterator<U>;
    }
}