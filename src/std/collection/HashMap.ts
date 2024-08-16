import { LinkedList } from "./LinkedList";
import { None, Option, Some } from "../handle/option";
import { panic } from "../stdio";

export interface Hash {
    hash(): number
}

export type DefaultHashableTypes = number | string | boolean;

export function default_hash<T extends DefaultHashableTypes>(value: T): number {
    if (typeIs(value, "number")) {
        return value; //our hash is supposed to be a number anyways
    }
    else if (typeIs(value, "string")) {
        //djb2 will be used here as per this implementation http://www.cse.yorku.ca/~oz/hash.html
        let hash = 5381;

        for (let i = 0; i < value.size(); i++) {
            let char = value.sub(i, i);

            let c = char.byte()[0];

            hash = ((hash << 5) + hash) + c;
        }
        return hash;
    }
    else if (typeIs(value, "boolean")) {
        //false: 0, true: 1
        return value ? 1 : 0;
    }
    panic(`values of type ${typeOf(value)} are not supported by the default hashing function`);
}

export function is_default_hashable(v: any): v is DefaultHashableTypes {
    return typeIs(v, "number") || typeIs(v, "string") || typeIs(v, "boolean");
}

export class HashMap<K extends DefaultHashableTypes | Hash, V extends defined> {
    private internal_data: {[k: number]: LinkedList<[K, V]>} = {};
    constructor(private numbuckets: number = 16) {

    }

    insert(k: K, value: V) {
        if (is_default_hashable(k)) {
            let index = default_hash(k) % this.numbuckets;
            let head: LinkedList<[K, V]> = {
                value: [k, value],
                next_node: this.internal_data[index]
            }
            this.internal_data[index] = head;
        }
        else {
            let index = k.hash() % this.numbuckets;
            let head: LinkedList<[K, V]> = {
                value: [k, value],
                next_node: this.internal_data[index]
            }
            this.internal_data[index] = head;
        }
    }
    get(k: K): Option<V> {
        let hashed = (is_default_hashable(k) ? default_hash(k) : k.hash()) % this.numbuckets;

        if (!this.internal_data[hashed]) return None();

        let node: LinkedList<[K, V]> | undefined = this.internal_data[hashed];
        while (true) {
            if (node === undefined) return None();

            if (node.value[0] === k) {
                return Some(node.value[1]);
            }

            node = node.next_node;
        }
    }
    contains(k: K): boolean {
        let hashed = (is_default_hashable(k) ? default_hash(k) : k.hash()) % this.numbuckets;

        if (!this.internal_data[hashed]) return false;

        let node: LinkedList<[K, V]> | undefined = this.internal_data[hashed];
        while (true) {
            if (node === undefined) return false;

            if (node.value[0] === k) {
                return true;
            }

            node = node.next_node;
        }
    }
    remove(k: K): Option<V> {
        let hashed = (is_default_hashable(k) ? default_hash(k) : k.hash()) % this.numbuckets;

        if (!this.internal_data[hashed]) return None()

        let node: LinkedList<[K, V]> | undefined = this.internal_data[hashed];
        let previous_node: LinkedList<[K, V]> | undefined = undefined;
        while (true) {
            if (node === undefined) return None();

            if (node.value[0] === k) {
                if (previous_node !== undefined) {
                    previous_node.next_node = node.next_node;
                }
                return Some(node.value[1]);
            }
            previous_node = node;
            node = node.next_node;
        }
    }
}