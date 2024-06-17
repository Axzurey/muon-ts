import { Option, Maybe } from "./option";
import { panic } from "./stdio";

export class UVec<T extends defined> {
    
    values: T[];

    constructor(init: T[]) {
        this.values = init;
    }

    push(val: T) {
        this.values.push(val);
    }
    insert(val: T, index: number) {
        if (index > this.values.size()) panic(`Index ${index} is greater than length of the vec.`);

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
}