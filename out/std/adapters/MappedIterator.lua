-- Compiled with roblox-ts v3.0.0
local MappedIterator
do
	MappedIterator = setmetatable({}, {
		__tostring = function()
			return "MappedIterator"
		end,
	})
	MappedIterator.__index = MappedIterator
	function MappedIterator.new(...)
		local self = setmetatable({}, MappedIterator)
		return self:constructor(...) or self
	end
	function MappedIterator:constructor(iter, fn)
		self.iter = iter
		self.fn = fn
		setmetatable(self, {
			__index = function(_, index)
				return MappedIterator[index] or self.iter[index]
			end,
			__tostring = function()
				return "MappedIterator"
			end,
		})
	end
	function MappedIterator:next()
		return self.iter:next():map(self.fn)
	end
end
return {
	MappedIterator = MappedIterator,
}
