import { useState } from 'react';

import { useMain } from '../context/MainContext';
import useNuiEvent from '../hooks/useNuiEvent';
import fetchNui from '../utils/fetchNui';
import { isProduction } from '../utils/Helpers';

interface ResponseType {
    notification: 'string';
}

interface PlayerData {
    id: string;
    name: string;
}

export default function IndexPage() {
    const { name, players } = useMain();
    const savedMessage = '';
    const [message, setMessage] = useState('');
    const [selectedPlayer, setPlayer] = useState('');
    const [playerData, setPlayerData] = useState<PlayerData[]>();
    const [notification, setNotification] = useState(
        isProduction ? '' : 'Notification here'
    );

    const fetchPlayer = async (player: string) => {
        setPlayer(player);
        await fetchNui<ResponseType>('fetch-player', {
            to: 'server',
            player
        });
    };

    const updatePlayer = async () => {
        await fetchNui<ResponseType>('update-player', {
            to: 'server',
            message: message || 'Empty message',
            player: selectedPlayer
        });
    };

    if (isProduction) {
        useNuiEvent<string>('notification', notificationFromServer => {
            setNotification(notificationFromServer);
        });

        useNuiEvent<PlayerData[]>('player-fetch', notificationFromServer => {
            setPlayerData(notificationFromServer);
        });
    }

    return (
        <div className="flex w-[56rem] flex-col items-center gap-4 rounded-md bg-gray-50 p-8">
            <h1 className="font-poppins text-3xl font-semibold capitalize text-indigo-400">
                Hello, {name}
            </h1>
            <p className="font-poppins text-lg text-gray-600">
                Press <span className="font-bold text-orange-600">ESC</span> to
                exit.
            </p>
            <div className="flex w-[32rem] flex-col items-center gap-4">
                <div className="w-[32rem]">
                    <label
                        className="font-poppins mb-2 block text-sm font-bold uppercase text-gray-700"
                        htmlFor="send_message"
                    >
                        Jogador
                    </label>
                    <select
                        className="font-poppins focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                        id="player_id"
                        onChange={e => fetchPlayer(e.target.value)}
                    >
                        <option>[Selecione um jogador]</option>
                        {players.map((player, index) => (
                            <option key={index} value={player.id}>
                                {player.name} - [{player.id}] - Distance{' '}
                                {player.distance}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-[32rem]">
                    <label
                        className="font-poppins mb-2 block text-sm font-bold uppercase text-gray-700"
                        htmlFor="send_message"
                    >
                        Message
                    </label>
                    <input
                        className="font-poppins focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                        id="send_message"
                        type="text"
                        placeholder="Type your message here"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        maxLength={100}
                    />
                </div>
                <p className="font-poppins font-semibold text-blue-400">
                    {savedMessage}
                </p>
                <div className="flex w-full justify-between gap-2">
                    <button
                        className="focus:shadow-outline w-full rounded bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700 focus:outline-none"
                        type="button"
                        onClick={updatePlayer}
                    >
                        Enviar
                    </button>
                </div>

                <div className="flex w-full justify-between gap-2">
                    {playerData &&
                        playerData.map(player => (
                            <p>
                                {player.id} | {player.name}
                            </p>
                        ))}
                </div>

                {notification && (
                    <p className="font-poppins font-semibold text-red-400">
                        {notification}
                    </p>
                )}
            </div>
        </div>
    );
}
