import { MappedIterator } from "../adapters/MappedIterator";
import { Option } from "../handle/option";
import { Result } from "../handle/result";
import { UInt } from "../types";
import { Vec } from "./vec";
export declare class RIterator<T extends defined> {
    private collection;
    next_index: UInt;
    constructor(collection: Vec<T>);
    next(): Option<T>;
    count(): UInt;
    last(): Option<T>;
    advance_by(by: UInt): Result<0, UInt>;
    nth(n: UInt): Option<any>;
    map<U extends defined>(fn: (item: T) => U): MappedIterator<U, T, typeof this> & RIterator<U>;
}
