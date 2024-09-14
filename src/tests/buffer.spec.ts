/// <reference types="@rbxts/testez/globals" />
import "@rbxts/testez"
import { SBuffer } from "../std/sbuffer";
export = () => {
    it("should permit buffers to seek correctly", () => {
        let buffer = SBuffer.with_capacity(4);

        buffer.write_u8(14);
        buffer.write_u8(15);

        expect(buffer.).to.be.equal(1);
    });
}