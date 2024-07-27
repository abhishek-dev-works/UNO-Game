import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';  // Update if needed

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
});

export default socket;
