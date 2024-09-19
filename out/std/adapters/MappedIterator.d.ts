import { RIterator } from "../collection/RIterator";
import { Option } from "../handle/option";
export declare class MappedIterator<F extends defined, R extends defined, U extends RIterator<R>> {
    private iter;
    private fn;
    constructor(iter: U, fn: (val: R) => F);
    next(): Option<F>;
}
