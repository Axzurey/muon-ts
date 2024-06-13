local transparency = {};
transparency.__index = transparency;

function transparency.new(model: Model)
    local transparencies = {};

    for _, v in model:GetDescendants() do
        if v:IsA("BasePart") then
            transparencies[v] = v.Transparency;
        elseif v:IsA("Decal") or v:IsA("ParticleEmitter") then
            transparencies[v] = v.Enabled;
        end
    end

    return setmetatable({model = model, transparencies = {}}, transparency);
end

function transparency:hide()
    for _, obj in self.model:GetDescendants() do
        if obj:IsA("BasePart") then
            obj.Transparency = 1;
        elseif obj:IsA("Decal") or obj:IsA("ParticleEmitter") then
            obj.Enabled = false;
        end
    end
end

function transparency:set_transparency(t: number)
    for _, obj in self.model:GetDescendants() do
        if obj:IsA("BasePart") then
            obj.Transparency = t;
        end
    end
end

function transparency:reset()
    for _, obj in self.model:GetDescendants() do
        if obj:IsA("BasePart") and self.transparencies[obj] then
            obj.Transparency = self.transparencies[obj];
        elseif obj:IsA("Decal") or obj:IsA("ParticleEmitter") and self.transparencies[obj] then
            obj.Enabled = self.transparencies[obj];
        end
    end
end

return transparency;