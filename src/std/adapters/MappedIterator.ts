import { RIterator } from "../collection/RIterator";
import { Option } from "../handle/option";

export class MappedIterator<F extends defined, R extends defined, U extends RIterator<R>> {
    constructor(private iter: U, private fn: (val: R) => F) {
        setmetatable(this, {
            "__index": (_, index) => {
                return MappedIterator[index as keyof typeof MappedIterator] || this.iter[index as keyof typeof this.iter];
            },
            "__tostring": () => {
                return "MappedIterator";
            }
        });
    }

    next(): Option<F> {
        return this.iter.next().map(this.fn);
    }
}