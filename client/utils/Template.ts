import { sendNuiMessage } from '../nui';
import { QBCore } from './Helpers';

interface PlayerData {
    id: string;
    name: string;
}

export default class Template {
    static open() {
        SetNuiFocus(true, true);

        const { PlayerData } = QBCore;
        const { name } = PlayerData;

        const ped = GetPlayerPed(-1);
        const playerCoord = GetEntityCoords(ped, false);
        const [px, py, pz] = playerCoord;
        const active = GetActivePlayers();

        const players = [];

        for (let i = 0; i < active.length; i += 1) {
            const player = active[i];
            const oped = GetPlayerPed(player);
            const [x, y, z] = GetEntityCoords(oped, true);
            const distance = GetDistanceBetweenCoords(
                x,
                y,
                z,
                px,
                py,
                pz,
                true
            );
            if (distance <= 5.0) {
                players.push({
                    id: GetPlayerServerId(player),
                    name: GetPlayerName(player),
                    distance
                });
            }
        }

        sendNuiMessage('show-ui', { name, players });
    }

    static sendNotification(notification: string) {
        sendNuiMessage('notification', notification);
    }

    static sendPlayerFetch(data: PlayerData[]) {
        sendNuiMessage('player-fetch', data);
    }
}
