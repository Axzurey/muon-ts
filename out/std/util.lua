-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local newproxy = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "types").newproxy
local function create_named_symbol(name)
	local meta = newproxy(true)
	local t = getmetatable(meta)
	t.__tostring = function()
		return name
	end
	return meta
end
return {
	create_named_symbol = create_named_symbol,
}
