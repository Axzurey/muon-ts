/// <reference types="@rbxts/testez/globals" />
import "@rbxts/testez"
import { RIterator } from "../std/collection/RIterator";
import { Vec } from "../std/collection/vec";

export = () => {
    it("should work properly with all iterator adapters", () => {
        let iterator = new Vec([1, 2, 3, 4, 5]).iter();

        let mapped = iterator.map((v) => v ** 2);

        expect(mapped.next().unwrap()).to.equal(1);
        expect(mapped.next().unwrap()).to.equal(4);
        
        mapped.advance_by(2);

        expect(mapped.next().unwrap()).to.equal(25);

        expect(mapped.next().is_some()).to.equal(false);

       
    });
}