import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        'reconnectAttempt': 'Infinity',
        'timeout': 10000,
        'transports': ['websocket']
    };

    return io(process.env.NEXT_PUBLIC_BACKEND_URL!, options)
}
