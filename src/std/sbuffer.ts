import { Err, Ok, Result } from "./handle/result";
import { ENode, VariantOf, create_enum } from "./renum";
import { try_op } from "./stdio";

export const BufferError = create_enum([
    ["BufferOutOfBounds", ENode<never>]    
] as const);

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
        this.offset += 1;
        return this.offset;
    }
    write_u8(u8: number) {
        return try_op(() => this.write_u8_unsafe(u8), BufferError.BufferOutOfBounds);
    }
    next_u8(offset?: number): Result<number, VariantOf<typeof BufferError>> {
        if (this.offset >= buffer.len(this.internal)) return Err(BufferError.BufferOutOfBounds);
        let u8 = buffer.readu8(this.internal, offset === undefined ? this.offset : offset);
        this.offset += 1;
        return Ok(u8);
    }
    write_u16_unsafe(u16: number): number {
        buffer.writeu16(this.internal, this.offset, u16);
        this.offset += 2;
        return this.offset;
    }
    write_u16(u16: number) {
        return try_op(() => this.write_u16_unsafe(u16), BufferError.BufferOutOfBounds);
    }
    next_u16(offset?: number): Result<number, VariantOf<typeof BufferError>> {
        if (this.offset + 1 >= buffer.len(this.internal)) return Err(BufferError.BufferOutOfBounds);
        let u16 = buffer.readu16(this.internal, offset === undefined ? this.offset : offset);
        this.offset += 2;
        return Ok(u16);
    }
    write_u32_unsafe(u32: number): number {
        buffer.writeu32(this.internal, this.offset, u32);
        this.offset += 4;
        return this.offset;
    }
    write_u32(u32: number) {
        return try_op(() => this.write_u32_unsafe(u32), BufferError.BufferOutOfBounds);
    }
    next_u32(offset?: number): Result<number, VariantOf<typeof BufferError>> {
        if (this.offset + 3 >= buffer.len(this.internal)) return Err(BufferError.BufferOutOfBounds);
        let u32 = buffer.readu32(this.internal, offset === undefined ? this.offset : offset);
        this.offset += 4;
        return Ok(u32);
    }
}