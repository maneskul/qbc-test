import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState
} from 'react';

import useNuiEvent from '../hooks/useNuiEvent';
import fetchNui from '../utils/fetchNui';
import { Dispatch, isProduction } from '../utils/Helpers';

interface Players {
    id: number;
    name: string;
    distance: number;
}

interface NuiData {
    name: string;
    players: Players[];
}

interface MainContextType {
    show: boolean;
    setShow: Dispatch<boolean>;
    name: string;
    players: Players[];
}

const MainContext = createContext<MainContextType>(null!);

const defaultValues = {
    name: 'BUR4KBEY',
    players: [{ id: 1, name: 'Teste', distance: 3.4 }] as Players[]
};

export function MainProvider({ children }: { children: ReactNode }) {
    const [show, setShow] = useState(!isProduction);
    const [name, setName] = useState(defaultValues.name);
    const [players, setPlayers] = useState(defaultValues.players);

    if (isProduction) {
        useNuiEvent<NuiData>('show-ui', data => {
            setName(data.name);
            setPlayers(data.players);
            setShow(true);
        });
    }

    useEffect(() => {
        if (!show && isProduction) {
            fetchNui('close-ui');
            setName(defaultValues.name);
        }
    }, [show]);

    const value: MainContextType = { show, setShow, name, players };

    return (
        <MainContext.Provider value={value}>{children}</MainContext.Provider>
    );
}

export function useMain() {
    return useContext(MainContext);
}
