-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
--/ <reference types="@rbxts/testez/globals" />
TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "testez", "src")
local Vec = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "collection", "vec").Vec
return function()
	it("testing vecs", function()
		do
			--should be able to get elements in order
			local vec = Vec.new({ 0, 1, 2, 3, 4, 5, 6, 7 })
			for i = 0, 6 do
				expect(vec:get(i):unwrap()).to.equal(i)
			end
			--should also be able to reverse elements
			vec:reverse()
			for i = 0, 6 do
				expect(vec:get(i):unwrap()).to.equal(7 - i)
			end
			--mapping should also work
			local mapped = vec:map(function(x)
				return "hello"
			end):unwrap()
			for i = 0, 6 do
				expect(mapped:get(i):unwrap()).to.equal("hello")
			end
		end
		do
			--check if inserting works properly
			local vec = Vec.new({ 0, 2, 3, 4, 5 })
			vec:insert(1, 1)
			expect(vec:get(1):unwrap()).to.equal(1)
		end
		do
			--test freezing vecs
			local vec = Vec.new({ 0, 2, 3, 4, 5 })
			vec:freeze()
			expect(vec:clear():is_ok()).to.be.equal(false)
		end
	end)
end
