import React, { useState } from 'react';
import socket from '../socket';

const LoginRoom = ({ setRoomId, setPlayerName }: { setRoomId: any, setPlayerName: any }) => {
  const [roomKey, setRoomKeyState] = useState('');
  const [playerName, setPlayerNameState] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);

  const createRoom = () => {
    if (playerName) {
      socket.emit('createRoom', maxPlayers, (roomId: any) => {
        setRoomId(roomId);
        setPlayerName(playerName);
      });
    } else {
      alert('Please enter your name');
    }
  };

  const joinRoom = () => {
    if (playerName && roomKey) {
      socket.emit('joinRoom', roomKey, playerName, (response: { success: any; message: any; }) => {
        if (response.success) {
          setRoomId(roomKey);
          setPlayerName(playerName);
        } else {
          alert(response.message);
        }
      });
    } else {
      alert('Please enter your name and room key');
    }
  };

  return (
    <div>
      <h2>UNO Game</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerNameState(e.target.value)}
      />
      <div>
        <button onClick={createRoom}>Create Room</button>
        <input
          type="number"
          min="2"
          max="4"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(Number(e.target.value))}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter room key"
          value={roomKey}
          onChange={(e) => setRoomKeyState(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default LoginRoom;
