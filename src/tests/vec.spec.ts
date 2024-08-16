/// <reference types="@rbxts/testez/globals" />
import "@rbxts/testez"
import { Vec } from "../std/collection/vec";

export = () => {
    it("should properly order elements", () => {
        {
            //should be able to get elements in order
            let vec = new Vec([0, 1, 2, 3, 4, 5, 6, 7]);

            for (let i = 0; i < 7; i++) {
                expect(vec.get(i).unwrap()).to.equal(i);
            }

            //should also be able to reverse elements
            vec.reverse();

            for (let i = 0; i < 7; i++) {
                expect(vec.get(i).unwrap()).to.equal(7 - i);
            }

            //mapping should also work
            let mapped = vec.map((x) => "hello").unwrap();

            for (let i = 0; i < 7; i++) {
                expect(mapped.get(i).unwrap()).to.equal("hello");
            }
        }

        {
            //check if inserting works properly
            let vec = new Vec([0, 2, 3, 4, 5]);

            vec.insert(1, 1)

            expect(vec.get(1).unwrap()).to.equal(1);
        }
    });
}