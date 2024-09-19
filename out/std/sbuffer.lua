-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _result = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "handle", "result")
local Err = _result.Err
local Ok = _result.Ok
local _renum = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "renum")
local ENode = _renum.ENode
local create_enum = _renum.create_enum
local try_op = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "stdio").try_op
local BufferError = create_enum({ { "BufferOutOfBounds", ENode } })
local SBuffer
do
	SBuffer = setmetatable({}, {
		__tostring = function()
			return "SBuffer"
		end,
	})
	SBuffer.__index = SBuffer
	function SBuffer.new(...)
		local self = setmetatable({}, SBuffer)
		return self:constructor(...) or self
	end
	function SBuffer:constructor(capacity, init)
		self.offset = 0
		self.internal = if init == nil then buffer.create(if capacity == nil then 0 else capacity) else init
	end
	function SBuffer:with_capacity(size)
		return self.new(size, nil)
	end
	function SBuffer:move_cursor(offset)
		self.offset = offset
	end
	function SBuffer:write_u8_unsafe(u8)
		buffer.writeu8(self.internal, self.offset, u8)
		self.offset += 1
		return self.offset
	end
	function SBuffer:write_u8(u8)
		return try_op(function()
			return self:write_u8_unsafe(u8)
		end, BufferError.BufferOutOfBounds)
	end
	function SBuffer:next_u8(offset)
		if self.offset >= buffer.len(self.internal) then
			return Err(BufferError.BufferOutOfBounds)
		end
		local u8 = buffer.readu8(self.internal, if offset == nil then self.offset else offset)
		self.offset += 1
		return Ok(u8)
	end
	function SBuffer:write_u16_unsafe(u16)
		buffer.writeu16(self.internal, self.offset, u16)
		self.offset += 2
		return self.offset
	end
	function SBuffer:write_u16(u16)
		return try_op(function()
			return self:write_u16_unsafe(u16)
		end, BufferError.BufferOutOfBounds)
	end
	function SBuffer:next_u16(offset)
		if self.offset + 1 >= buffer.len(self.internal) then
			return Err(BufferError.BufferOutOfBounds)
		end
		local u16 = buffer.readu16(self.internal, if offset == nil then self.offset else offset)
		self.offset += 2
		return Ok(u16)
	end
	function SBuffer:write_u32_unsafe(u32)
		buffer.writeu32(self.internal, self.offset, u32)
		self.offset += 4
		return self.offset
	end
	function SBuffer:write_u32(u32)
		return try_op(function()
			return self:write_u32_unsafe(u32)
		end, BufferError.BufferOutOfBounds)
	end
	function SBuffer:next_u32(offset)
		if self.offset + 3 >= buffer.len(self.internal) then
			return Err(BufferError.BufferOutOfBounds)
		end
		local u32 = buffer.readu32(self.internal, if offset == nil then self.offset else offset)
		self.offset += 4
		return Ok(u32)
	end
end
return {
	BufferError = BufferError,
	SBuffer = SBuffer,
}
