QBCore.Functions.CreateCallback('template:fetch-player', function(source, cb)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    local citizenId = Player.PlayerData.citizenid

    print(citizenId)

    cb(result)
end)