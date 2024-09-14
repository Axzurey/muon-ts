import { Err, Ok, Result } from "./handle/result";

export function panic(message: string, start_level: number = 0): never {
    error(message, 2 + start_level);
}

export function get_stack_trace(withmsg?: string, startlevel: number = 0): string {
    return debug.traceback(withmsg, 3 + startlevel);
}

export function try_op<T extends defined, E extends defined>(fn: () => T, err: E): Result<T, E> {
    let [success, out] = pcall(fn);
    if (success) {
        return Ok(out as T)
    }
    else {
        return Err(err);
    }
}