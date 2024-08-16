import { newproxy } from "./types";

export function create_named_symbol(name: string) {
    let meta = newproxy(true);

    let t: any = getmetatable(meta);
    t.__tostring = () => name;

    return meta;
}