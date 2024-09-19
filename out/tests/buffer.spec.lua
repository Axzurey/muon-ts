-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
--/ <reference types="@rbxts/testez/globals" />
TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "testez", "src")
local SBuffer = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "sbuffer").SBuffer
return function()
	it("should permit buffers to seek correctly", function()
		local buffer = SBuffer:with_capacity(1 + 1 + 2 + 4)
		buffer:write_u8(16)
		buffer:write_u8(1)
		buffer:write_u16(2)
		buffer:write_u32(1432)
		buffer:move_cursor(0)
		expect(buffer:next_u8():unwrap()).to.be.equal(16)
		expect(buffer:next_u8():unwrap()).to.be.equal(1)
		expect(buffer:next_u16():unwrap()).to.be.equal(2)
		expect(buffer:next_u32():unwrap()).to.be.equal(1432)
	end)
end
