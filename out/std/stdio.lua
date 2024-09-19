-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _result = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "handle", "result")
local Err = _result.Err
local Ok = _result.Ok
local function panic(message, start_level)
	if start_level == nil then
		start_level = 0
	end
	error(message, 2 + start_level)
end
local function get_stack_trace(withmsg, startlevel)
	if startlevel == nil then
		startlevel = 0
	end
	return debug.traceback(withmsg, 3 + startlevel)
end
local function try_op(fn, err)
	local success, out = pcall(fn)
	if success then
		return Ok(out)
	else
		return Err(err)
	end
end
return {
	panic = panic,
	get_stack_trace = get_stack_trace,
	try_op = try_op,
}
