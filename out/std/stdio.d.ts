import { Result } from "./handle/result";
export declare function panic(message: string, start_level?: number): never;
export declare function get_stack_trace(withmsg?: string, startlevel?: number): string;
export declare function try_op<T extends defined, E extends defined>(fn: () => T, err: E): Result<T, E>;
