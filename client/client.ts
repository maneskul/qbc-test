import { createNuiCallBacks } from './nui';
import Template from './utils/Template';

on('onResourceStart', (resName: string) => {
    if (resName === GetCurrentResourceName()) {
        // eslint-disable-next-line no-console
        console.log(
            `Script inicializado! Use o comando '/testar' para abrir o UI menu.`
        );
    }
});

createNuiCallBacks();

RegisterCommand('testar', Template.open, false);

onNet('template:send-notification', Template.sendNotification);
