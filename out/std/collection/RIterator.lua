-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local MappedIterator = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "adapters", "MappedIterator").MappedIterator
local None = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "handle", "option").None
local _result = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "handle", "result")
local Err = _result.Err
local Ok = _result.Ok
local RIterator
do
	RIterator = setmetatable({}, {
		__tostring = function()
			return "RIterator"
		end,
	})
	RIterator.__index = RIterator
	function RIterator.new(...)
		local self = setmetatable({}, RIterator)
		return self:constructor(...) or self
	end
	function RIterator:constructor(collection)
		self.collection = collection
		self.next_index = 0
		table.freeze(collection)
	end
	function RIterator:next()
		local value = self.collection:get(self.next_index)
		if value:is_some() then
			self.next_index += 1
		end
		return value
	end
	function RIterator:count()
		local count = 0
		while true do
			local value = self:next()
			if value:is_none() then
				break
			end
			count += 1
		end
		return count
	end
	function RIterator:last()
		local previous = self:next()
		if previous:is_none() then
			return previous
		end
		while true do
			local current = self:next()
			if current:is_none() then
				return previous
			end
			previous = current
		end
	end
	function RIterator:advance_by(by)
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < by) then
					break
				end
				if self:next():is_none() then
					return Err(by - i)
				end
			end
		end
		return Ok(0)
	end
	function RIterator:nth(n)
		if self:advance_by(n):is_err() then
			return None()
		end
		return self:next()
	end
	function RIterator:map(fn)
		return MappedIterator.new(self, fn)
	end
end
return {
	RIterator = RIterator,
}
