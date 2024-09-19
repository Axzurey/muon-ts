-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
--/ <reference types="@rbxts/testez/globals" />
TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "testez", "src")
local Vec = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "collection", "vec").Vec
return function()
	it("should work properly with all iterator adapters", function()
		local iterator = Vec.new({ 1, 2, 3, 4, 5 }):iter()
		local mapped = iterator:map(function(v)
			return v ^ 2
		end)
		expect(mapped:next():unwrap()).to.equal(1)
		expect(mapped:next():unwrap()).to.equal(4)
		mapped:advance_by(2)
		expect(mapped:next():unwrap()).to.equal(25)
		expect(mapped:next():is_some()).to.equal(false)
	end)
end
