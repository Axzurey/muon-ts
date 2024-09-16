/// <reference types="@rbxts/testez/globals" />
import "@rbxts/testez"
import { SBuffer } from "../std/sbuffer";
export = () => {
    it("should permit buffers to seek correctly", () => {
        let buffer = SBuffer.with_capacity(1 + 1 + 2 + 4);

        buffer.write_u8(16);
        buffer.write_u8(1);
        buffer.write_u16(2);
        buffer.write_u32(1432);

        buffer.move_cursor(0);

        expect(buffer.next_u8()).to.be.equal(16);
        expect(buffer.next_u8()).to.be.equal(1);
        expect(buffer.next_u16()).to.be.equal(2);
        expect(buffer.next_u32()).to.be.equal(1432);
    });
}