-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local panic = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "stdio").panic
local Some, None
local Option
do
	Option = setmetatable({}, {
		__tostring = function()
			return "Option"
		end,
	})
	Option.__index = Option
	function Option.new(...)
		local self = setmetatable({}, Option)
		return self:constructor(...) or self
	end
	function Option:constructor(value)
		if value ~= nil then
			self._variant = Option.Some
		else
			self._variant = Option.None
		end
		self._innervalue = value
	end
	function Option:is_some()
		return self._innervalue ~= nil
	end
	function Option:is_none()
		return self._innervalue == nil
	end
	function Option:unwrap()
		if self._innervalue == nil then
			panic("Attempt to unwrap a None variant of an Option")
		else
			return self._innervalue
		end
	end
	function Option:expect(msg)
		if self._innervalue == nil then
			panic(msg)
		else
			return self._innervalue
		end
	end
	function Option:unwrap_or(defaultvalue)
		if self._innervalue == nil then
			return defaultvalue
		else
			return self._innervalue
		end
	end
	function Option:unwrap_or_else(defaultfn)
		if self._innervalue == nil then
			return defaultfn()
		else
			return self._innervalue
		end
	end
	function Option:map(fn)
		if self._innervalue == nil then
			return Option.new(nil)
		else
			return Option.new(fn(self._innervalue))
		end
	end
	function Option:flatten()
		if self._innervalue ~= nil and (self._innervalue)._innervalue ~= nil then
			return Some((self._innervalue)._innervalue)
		else
			if self._innervalue == nil then
				return None()
			else
				return Some(self._innervalue)
			end
		end
	end
	function Option:filter(predicate)
		if self._innervalue ~= nil then
			if predicate(self._innervalue) then
				return Some(self._innervalue)
			else
				return None()
			end
		else
			return None()
		end
	end
	Option.Some = 0
	Option.None = 1
end
function Some(value)
	return Option.new(value)
end
function None()
	return Option.new(nil)
end
local function Maybe(val)
	if val == nil then
		return None()
	else
		return Some(val)
	end
end
return {
	Some = Some,
	None = None,
	Maybe = Maybe,
	Option = Option,
}
