-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Maybe = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "handle", "option").Maybe
local _result = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "handle", "result")
local Err = _result.Err
local Ok = _result.Ok
local REnum = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "renum").REnum
local panic = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "stdio").panic
local RIterator = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "collection", "RIterator").RIterator
local VecErr
do
	local super = REnum
	VecErr = setmetatable({}, {
		__tostring = function()
			return "VecErr"
		end,
		__index = super,
	})
	VecErr.__index = VecErr
	function VecErr.new(...)
		local self = setmetatable({}, VecErr)
		return self:constructor(...) or self
	end
	function VecErr:constructor(variant, inner)
		super.constructor(self)
		self._variant = variant
		self._innervalue = inner
	end
	function VecErr:create(variant, value)
		return self.new(variant, value)
	end
	VecErr.Frozen = 0
	VecErr.OutOfBounds = 1
end
local Vec
do
	Vec = setmetatable({}, {
		__tostring = function()
			return "Vec"
		end,
	})
	Vec.__index = Vec
	function Vec.new(...)
		local self = setmetatable({}, Vec)
		return self:constructor(...) or self
	end
	function Vec:constructor(init)
		self.frozen = false
		self.values = if init == nil then {} else init
	end
	function Vec:with_capacity(size)
		return Vec.new(table.create(size))
	end
	function Vec:iter()
		return RIterator.new(self)
	end
	function Vec:freeze()
		table.freeze(self.values)
		self.frozen = true
	end
	function Vec:is_frozen()
		return self.frozen
	end
	function Vec:append(other)
		if self:is_frozen() then
			return Err(VecErr:create(VecErr.Frozen, "Vec has already been frozen"))
		end
		while true do
			local res = other:pop():unwrap()
			if res:is_none() then
				break
			end
			self:push(res:unwrap())
		end
	end
	function Vec:is_empty()
		return self:len() == 0
	end
	function Vec:split_off(at)
		if self:is_frozen() then
			return Err(VecErr:create(VecErr.Frozen, "Vec has already been frozen"))
		end
		if at > self:len() or at < 0 then
			panic(`Attempt to split UVec at {at} when length is {self:len()}`)
		end
		local data = {}
		do
			local i = self:len() - 1
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i -= 1
				else
					_shouldIncrement = true
				end
				if not (i >= at) then
					break
				end
				data[i - at + 1] = self:pop():unwrap():unwrap()
			end
		end
		return Ok(Vec.new(data))
	end
	function Vec:len()
		return #self.values
	end
	function Vec:clear()
		if self:is_frozen() then
			return Err(VecErr:create(VecErr.Frozen, "Vec has already been frozen"))
		end
		table.clear(self.values)
		return Ok(0)
	end
	function Vec:push(val)
		if self:is_frozen() then
			return Err(VecErr:create(VecErr.Frozen, "Vec has already been frozen"))
		end
		local _values = self.values
		local _val = val
		table.insert(_values, _val)
		return Ok(0)
	end
	function Vec:insert(val, index)
		if self:is_frozen() then
			return Err(VecErr:create(VecErr.Frozen, "Vec has already been frozen"))
		end
		if index > self:len() or index < 0 then
			return Err(VecErr:create(VecErr.OutOfBounds, `Index {index} is greater than length of the UVec({self:len()}) or less than 0.`))
		end
		local _values = self.values
		local _index = index
		local _val = val
		table.insert(_values, _index + 1, _val)
		return Ok(0)
	end
	function Vec:index(v)
		local _values = self.values
		local _v = v
		return Maybe((table.find(_values, _v) or 0) - 1)
	end
	function Vec:remove(index)
		if self:is_frozen() then
			return Err(VecErr:create(VecErr.Frozen, "Vec has already been frozen"))
		end
		local _values = self.values
		local _index = index
		return Ok(Maybe(table.remove(_values, _index + 1)))
	end
	function Vec:remove_swap(index)
		if self:is_frozen() then
			return Err(VecErr:create(VecErr.Frozen, "Vec has already been frozen"))
		end
		local _values = self.values
		local _index = index
		-- ▼ Array.unorderedRemove ▼
		local _index_1 = _index + 1
		local _length = #_values
		local _value = _values[_index_1]
		if _value ~= nil then
			_values[_index_1] = _values[_length]
			_values[_length] = nil
		end
		-- ▲ Array.unorderedRemove ▲
		return Ok(Maybe(_value))
	end
	function Vec:pop()
		if self:is_frozen() then
			return Err(VecErr:create(VecErr.Frozen, "Vec has already been frozen"))
		end
		local _exp = self.values
		-- ▼ Array.pop ▼
		local _length = #_exp
		local _result_1 = _exp[_length]
		_exp[_length] = nil
		-- ▲ Array.pop ▲
		return Ok(Maybe(_result_1))
	end
	function Vec:foreach(callback)
		local _values = self.values
		local _callback = callback
		for _k, _v in _values do
			_callback(_v, _k - 1, _values)
		end
	end
	function Vec:map(transform)
		if self:is_frozen() then
			return Err(VecErr:create(VecErr.Frozen, "Vec has already been frozen"))
		end
		local _values = self.values
		local _transform = transform
		-- ▼ ReadonlyArray.map ▼
		local _newValue = table.create(#_values)
		for _k, _v in _values do
			_newValue[_k] = _transform(_v, _k - 1, _values)
		end
		-- ▲ ReadonlyArray.map ▲
		return Ok(Vec.new(_newValue))
	end
	function Vec:first()
		return Maybe(self.values[1])
	end
	function Vec:last()
		return Maybe(self.values[self:len()])
	end
	function Vec:get(index)
		return Maybe(self.values[index + 1])
	end
	function Vec:reverse()
		if self:is_frozen() then
			return Err(VecErr:create(VecErr.Frozen, "Vec has already been frozen"))
		end
		local len = self:len()
		local flen = math.floor(len / 2)
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < flen) then
					break
				end
				local x = self.values[i + 1]
				local y = self.values[len - i]
				self.values[i + 1] = y
				self.values[len - i] = x
			end
		end
		return Ok(0)
	end
end
return {
	VecErr = VecErr,
	Vec = Vec,
}
