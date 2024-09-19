-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
--/ <reference types="@rbxts/testez/globals" />
TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "testez", "src")
local _renum = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "renum")
local ENode = _renum.ENode
local REnum = _renum.REnum
local create_enum = _renum.create_enum
local match = _renum.match
local _option = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "handle", "option")
local Option = _option.Option
local Some = _option.Some
local _result = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "handle", "result")
local Err = _result.Err
local Result = _result.Result
return function()
	it("should match enums properly", function()
		local SomeEnum
		do
			local super = REnum
			SomeEnum = setmetatable({}, {
				__tostring = function()
					return "SomeEnum"
				end,
				__index = super,
			})
			SomeEnum.__index = SomeEnum
			function SomeEnum.new(...)
				local self = setmetatable({}, SomeEnum)
				return self:constructor(...) or self
			end
			function SomeEnum:constructor(variant, inner)
				super.constructor(self)
				self._variant = variant
				self._innervalue = inner
			end
			function SomeEnum:create(variant, value)
				return self.new(variant, value)
			end
			SomeEnum.Hi = 0
			SomeEnum.Bye = 1
			SomeEnum.Boo = 2
		end
		local value = SomeEnum:create(SomeEnum.Bye, "good night!")
		local res = match(value, {
			[SomeEnum.Hi] = function(x)
				return 3
			end,
			[SomeEnum.Bye] = function(y)
				return "hello"
			end,
		}, function(x)
			return 1
		end)
		expect(res).to.equal("hello")
		expect(match(3, {
			[1] = function(z) end,
			[3] = function(x)
				return 2
			end,
		}, function(v)
			return 3
		end)).to.equal(2)
		expect(match("hello", {
			hi = function(z) end,
		}, function(v)
			return 3
		end)).to.equal(3)
	end)
	it("Should support automated enum creation", function()
		local myclass = create_enum({ { "A", ENode }, { "B", ENode }, { "C", ENode } })
		--basic matching
		local variant = myclass:create(myclass.A, "hello!")
		expect(match(variant, {
			[myclass.A] = function(x)
				return 1
			end,
			[myclass.B] = function(x)
				return 2
			end,
			[myclass.C] = function(x)
				return 2
			end,
		})).to.be.equal(1)
		--nested matching
		variant = myclass:create(myclass.B, 3)
		expect(match(variant, {
			[myclass.A] = function()
				return 1
			end,
			[myclass.B] = function(x)
				return match(x, {
					[1] = function()
						return "ONE"
					end,
					[3] = function()
						return "THREE"
					end,
				}, function(fallthrough)
					return "FALL"
				end)
			end,
			[myclass.C] = function()
				return 3
			end,
		})).to.be.equal("THREE")
		variant = myclass:create(myclass.B, 4)
		--nested matching w/fallthrough
		expect(match(variant, {
			[myclass.A] = function()
				return 1
			end,
			[myclass.B] = function(x)
				return match(x, {
					[1] = function()
						return "ONE"
					end,
					[3] = function()
						return "THREE"
					end,
				}, function(fallthrough)
					return "NEITHER"
				end)
			end,
			[myclass.C] = function()
				return 3
			end,
		})).to.be.equal("NEITHER")
	end)
	it("Should work on results and options :)", function()
		local option = Some(3)
		match(option, {
			[Option.Some] = function(x)
				return "uno"
			end,
			[Option.None] = function()
				return "None variant! (no parameter)"
			end,
		})
		local result = Err("IT's AN ERROR!")
		match(result, {
			[Result.Ok] = function(x) end,
			[Result.Err] = function(z) end,
		})
	end)
end
