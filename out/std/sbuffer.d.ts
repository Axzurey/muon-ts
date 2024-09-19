import { Result } from "./handle/result";
import { VariantOf } from "./renum";
export declare const BufferError: {
    new (variant: number, inner: never): {
        _typehint: {
            BufferOutOfBounds: import("./renum").EnumDefPair<0, never>;
        };
        _innervalue: never;
        _variant: number;
    };
    create<R extends 0>(variant: R, value: ReturnType<(readonly [readonly ["BufferOutOfBounds", () => never]])[R][1]>): {
        _typehint: {
            BufferOutOfBounds: import("./renum").EnumDefPair<0, never>;
        };
        _innervalue: never;
        _variant: number;
    };
} & {
    BufferOutOfBounds: 0;
} & {
    _typehint: {
        BufferOutOfBounds: import("./renum").EnumDefPair<0, never>;
    };
};
export declare class SBuffer {
    private internal;
    private offset;
    constructor(capacity?: number, init?: buffer);
    static with_capacity(size: number): SBuffer;
    move_cursor(offset: number): void;
    write_u8_unsafe(u8: number): number;
    write_u8(u8: number): Result<number, 0>;
    next_u8(offset?: number): Result<number, VariantOf<typeof BufferError>>;
    write_u16_unsafe(u16: number): number;
    write_u16(u16: number): Result<number, 0>;
    next_u16(offset?: number): Result<number, VariantOf<typeof BufferError>>;
    write_u32_unsafe(u32: number): number;
    write_u32(u32: number): Result<number, 0>;
    next_u32(offset?: number): Result<number, VariantOf<typeof BufferError>>;
}
