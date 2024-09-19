-- Compiled with roblox-ts v3.0.0
local Result
do
	Result = setmetatable({}, {
		__tostring = function()
			return "Result"
		end,
	})
	Result.__index = Result
	function Result.new(...)
		local self = setmetatable({}, Result)
		return self:constructor(...) or self
	end
	function Result:constructor(value, variant)
		if variant == Result.Ok then
			self._variant = Result.Ok
		elseif variant == Result.Err then
			self._variant = Result.Err
		else
			error("Invalid Result variant")
		end
		self._innervalue = value
	end
	function Result:unwrap()
		if self:is_err() then
			error("Attempt to unwrap an Err variant of a Result")
		else
			return self._innervalue
		end
	end
	function Result:is_ok()
		if self._variant == Result.Ok then
			return true
		end
		return false
	end
	function Result:is_err()
		if self._variant == Result.Err then
			return true
		end
		return false
	end
	Result.Ok = 0
	Result.Err = 1
end
local function Ok(value)
	return Result.new(value, Result.Ok)
end
local function Err(err)
	return Result.new(err, Result.Err)
end
return {
	Ok = Ok,
	Err = Err,
	Result = Result,
}
