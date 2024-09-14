import { ENode, create_enum } from "./renum";
import { try_op } from "./stdio";

export const BufferError = create_enum([[
    "BufferOutOfBounds", ENode<number>
]]);

export class SBuffer {
    private internal: buffer;
    private offset: number = 0;
    constructor(capacity?: number, init?: buffer) {
        this.internal = init === undefined ? buffer.create(capacity === undefined ? 0 : capacity) : init;
    }
    static with_capacity(size: number) {
        return new this(size, undefined);
    }
    move_cursor(offset: number) {
        this.offset = offset;
    }
    write_u8_unsafe(u8: number): number {
        buffer.writeu8(this.internal, this.offset, u8);
        this.offset += 2;
        return this.offset;
    }
    write_u8(u8: number) {
        return try_op(() => this.write_u8_unsafe(u8), BufferError.BufferOutOfBounds);
    }
    next_u8(offset?: number): number {
        let u8 = buffer.readu8(this.internal, offset === undefined ? this.offset : offset);
        this.offset += 2;
        return u8;
    }
    write_u16(u16: number) {
        buffer.writeu16(this.internal, this.offset, u16);
    }
}