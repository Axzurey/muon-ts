--totally not stolen from https://github.com/roblox-ts/roblox-ts/blob/master/tests/runTestsWithLune.lua

local roblox = require("@lune/roblox")
local fs = require("@lune/fs")
local luau = require("@lune/luau")
local process = require("@lune/process")
local stdio = require("@lune/stdio")
local Instance = roblox.Instance;

local testPlacePath = "./testplace.rbxl"

local game = roblox.deserializePlace(fs.readFile(testPlacePath));

local function tableJoin(...)
	local result = {}
	for i = 1, select("#", ...) do
		for k, v in select(i, ...) do
			result[k] = v
		end
	end
	return result
end

-- not 100% accurate to tick() functionality, but good enough for TestEZ usage
local function tick()
	return os.clock()
end

-- roblox.spec.ts assumes Workspace already exists
game:GetService("Workspace")

-- RuntimeLib uses :WaitForChild(), but tests don't need networking so :FindFirstChild() should be fine
roblox.implementMethod("Instance", "WaitForChild", function(self, ...)
	return self:FindFirstChild(...)
end)

-- TestEZ uses TestService:Error() when tests fail
roblox.implementMethod("TestService", "Error", function(self, description: string, source: Instance?, line: number?)
	stdio.ewrite(`{description}\n`)
end)

-- Promise.lua indexes RunService.Heartbeat, but only uses it in Promise.defer and Promise.delay
roblox.implementProperty("RunService", "Heartbeat", function()
	return {}
end, function() end)

local robloxRequire

local function runRobloxScript(script: LuaSourceContainer)
	local callableFn = luau.load(luau.compile(script.Source), {
		debugName = script:GetFullName(),
		environment = tableJoin(roblox, {
			game = game,
			script = script,
			require = robloxRequire,
			tick = tick,
		}),
	})

	return callableFn()
end

local requireCache = {}

function robloxRequire(moduleScript: ModuleScript)
	-- the same script instance sometimes gives a different ref
	-- unsure why, but using :GetFullName() fixes this for now
	local scriptPath = moduleScript:GetFullName()
	local cached = requireCache[scriptPath]
	if cached then
		return table.unpack(cached)
	end

	local result = table.pack(runRobloxScript(moduleScript))
	requireCache[scriptPath] = result
	return table.unpack(result)
end

function add_to_game(parent: Instance, name: string, is_script: boolean, contents: string)
	--print("added", name);
	local n = Instance.new(is_script and "Script" or "ModuleScript");
	n.Source = contents;
	n.Name = name;
	n.Parent = parent;
	print(n:GetFullName())
end

function add_to_game_folder(parent: Instance, name: string)
	--print("added", name);
	local n = Instance.new("Folder");
	n.Name = name;
	n.Parent = parent;
	--print(n:GetFullName())
end

function has_named(path: string, name: string)
	for _, named in fs.readDir(path) do
		if named == name then return true end;
	end
	return false;
end

function add_to_game_module(parent: Instance, name: string, contents: string)
	local n = Instance.new("ModuleScript");
	n.Source = contents;
	n.Name = name;
	n.Parent = parent;
end

function recursive_add(path: string, parent: Instance)
	for _, name in fs.readDir(path) do
		--print(path .. "/" .. name)
		if fs.isFile(path .. "/" .. name) then
			local split = string.split(name, ".");
			if (split[#split] ~= "lua" and split[#split] ~= "luau") or name[1] == "init" then
				--print(path, name, "not lua")
				continue;
			end
			add_to_game(parent, split[2] == "spec" and split[1] .. "." .. split[2] or split[1], split[2] == "server", fs.readFile(path .. "/" .. name));
		end
		if fs.isDir(path .. "/" .. name) then
			if has_named(path .. "/" .. name, "init.luau") then
				add_to_game_module(parent, name, fs.readFile(path .. "/" .. name .. "/init.luau"));
			elseif has_named(path .. "/" .. name, "init.lua") then
				add_to_game_module(parent, name, fs.readFile(path .. "/" .. name .. "/init.lua"));
			else
				add_to_game_folder(parent, name);
			end
	
			recursive_add(path .. "/" .. name, parent:FindFirstChild(name));
		end
	end
end

add_to_game_folder(game.ServerScriptService, "TS");
recursive_add("./out", game.ServerScriptService.TS);
add_to_game_folder(game.ReplicatedStorage, "rbxts_include");
recursive_add("./include", game.ReplicatedStorage.rbxts_include);
add_to_game_folder(game.ReplicatedStorage.rbxts_include, "node_modules");
add_to_game_folder(game.ReplicatedStorage.rbxts_include.node_modules, "@rbxts");
recursive_add("./node_modules/@rbxts", game.ReplicatedStorage.rbxts_include.node_modules["@rbxts"]);
runRobloxScript(game.ServerScriptService.TS.testrun.testrunner)


local meta = setmetatable({variant = 0}, {
	__call = function(arg)
		print(arg .. " is the inner value");
	end
})