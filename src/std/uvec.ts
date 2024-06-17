import { Option, Maybe } from "./option";
import { panic } from "./stdio";

export class UVec<T extends defined> {
    
    private values: T[];

    constructor(init: T[]) {
        this.values = init;
    }
    static allocated<T extends defined>(size: number): UVec<T> {
        return new UVec(table.create(size));
    }
    /**
     * moves all elements from other into self. At the end of the operation, other will be empty
     */
    append(other: UVec<T>) {
        while (true) {
            let res = other.pop();
            if (res.is_none()) break;
            this.push(res.unwrap());
        }
    }
    is_empty(): boolean {
        return this.len() == 0;
    }
    split_off(at: number): UVec<T> {
        if (at > this.len() || at < 0) panic(`Attempt to split UVec at ${at} when length is ${this.len()}`);

        let data: T[] = [];
        for (let i = this.len() - 1; i >= at; i--) {
            data[i - at] = this.pop().unwrap();
        }

        return new UVec(data);
    }
    len(): number {
        return this.values.size();
    }
    clear() {
        this.values.clear();
    }
    push(val: T) {
        this.values.push(val);
    }
    insert(val: T, index: number) {
        if (index > this.len() || index < 0) panic(`Index ${index} is greater than length of the UVec(${this.len()}) or less than 0.`);

        this.values.insert(index, val);
    }
    index(v: T): Option<number> {
        return Maybe(this.values.indexOf(v));
    }
    remove(index: number): Option<T> {
        return Maybe(this.values.remove(index));
    }
    remove_swap(index: number) {
        return Maybe(this.values.unorderedRemove(index));
    }
    pop(): Option<T> {
        return Maybe(this.values.pop());
    }
    foreach(callback: (val: T) => any) {
        this.values.forEach(callback);
    }
    map<R extends defined>(transform: (val: T) => R): UVec<R> {
        return new UVec(this.values.map(transform));
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
    reverse() {
        let flen = math.floor(this.len() / 2);
        for (let i = 0; i < flen; i++) {
            let x = this.values[i];
            let y = this.values[flen - i];
            this.values[i] = y;
            this.values[flen - i] = x;
        }
    }
}