export function panic(message: string, start_level: number = 0) {
    error(message, 3 + start_level);
}

export function get_stack_trace(withmsg?: string, startlevel: number = 0) {
    let out = debug.traceback(withmsg, 3 + startlevel);
}