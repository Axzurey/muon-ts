-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local panic = TS.import(script, game:GetService("ServerScriptService"), "TS", "std", "stdio").panic
local REnum
do
	REnum = {}
	function REnum:constructor()
	end
end
local function match(obj, tabl, fallthrough)
	local _obj = obj
	if type(_obj) == "number" then
		local _value = tabl[obj]
		if _value ~= 0 and _value == _value and _value ~= "" and _value then
			return tabl[obj](obj)
		else
			local _arg0 = fallthrough ~= nil
			assert(_arg0, "Fallthrough must be provided when any match arms are not covered.")
			return fallthrough(obj)
		end
	else
		local _obj_1 = obj
		if type(_obj_1) == "string" then
			if tabl[obj] then
				return tabl[obj](obj)
			else
				local _arg0 = fallthrough ~= nil
				assert(_arg0, "Fallthrough must be provided when any match arms are not covered.")
				return fallthrough(obj)
			end
		elseif obj._variant ~= nil then
			if tabl[obj._variant] then
				return tabl[obj._variant](obj._innervalue)
			else
				local _arg0 = fallthrough ~= nil
				assert(_arg0, "Fallthrough must be provided when any match arms are not covered.")
				return fallthrough(obj._variant)
			end
		else
			panic(`Object {obj} is not allowed in a match statement`)
		end
	end
end
--[[
	*
	 * This function signature is used as a type for the create_enum function. (please don't call this)
	 * @returns "T" but it panics when you call it 😄 (don't call it I beg of you)
	 
]]
local function ENode()
	panic("Please do not call the ENode function. Thank you.")
end
local function create_enum(variants)
	local _class
	do
		local super = REnum
		_class = setmetatable({}, {
			__tostring = function()
				return "Anonymous"
			end,
			__index = super,
		})
		_class.__index = _class
		function _class.new(...)
			local self = setmetatable({}, _class)
			return self:constructor(...) or self
		end
		function _class:constructor(variant, inner)
			super.constructor(self)
			self._variant = variant
			self._innervalue = inner
		end
		function _class:create(variant, value)
			return self.new(variant, value)
		end
	end
	local enumclass = _class
	for i = 0, #variants - 1 do
		--we're going to put the enum name as a static member of the class at runtime, with it's value being it's variant
		enumclass[variants[i + 1][1]] = i
	end
	--incase i need this later {[K in typeof variants[number][0]]: ReturnType<Extract<typeof variants[number], [K, any]>[1]>};
	return enumclass
end
return {
	match = match,
	ENode = ENode,
	create_enum = create_enum,
	REnum = REnum,
}
