import TestEZ from "@rbxts/testez";
let res = TestEZ.TestBootstrap.run([script.Parent!.Parent!.FindFirstChild("tests")!]);

print(res.errors[0])

