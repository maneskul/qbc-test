import fetch from 'node-fetch';

interface NuiData {
    to: 'client' | 'server';
    player: number;
    source: number;
    message: string;
}

interface PlayerData {
    id: number;
    name: string;
}

on('onResourceStart', (resName: string) => {
    if (resName === GetCurrentResourceName()) {
        // eslint-disable-next-line no-console
        console.log('TypeScript template started!');
    }
});

onNet('template:fetch-player', async (nuiData: NuiData) => {
    const currentID = source || nuiData.source;

    const response = await fetch(
        `https://my-json-server.typicode.com/maneskul/users-db/users?id=${nuiData.player}`
    );
    const json = await response.json();

    emitNet('template:send-player', currentID, json);
});

onNet('template:update-player', async (nuiData: NuiData) => {
    const currentID = source || nuiData.source;

    const response = await fetch(
        `https://my-json-server.typicode.com/maneskul/users-db/users?id=${nuiData.player}`
    );
    const json = (await response.json()) as PlayerData[];
    const hasPlayer = json.length > 0;
    const method = hasPlayer ? 'put' : 'post';

    await fetch(`https://my-json-server.typicode.com/maneskul/users-db/users`, {
        method,
        body: { id: nuiData.player, name: nuiData.message },
        headers: { 'Content-Type': 'application/json' }
    });

    emitNet('template:send-player', currentID, [
        {
            id: nuiData.player,
            name: nuiData.message
        }
    ]);
});

onNet('template:send-message', (message: string) => {
    // eslint-disable-next-line no-console
    console.log(`[Message] ${message}`);

    emitNet(
        'template:send-notification',
        source,
        'Message sent to server. Please check it from console.'
    );
});
