import React, { useState } from 'react';
import LoginRoom from './components/LoginRoom';
import GameRoom from './components/GameRoom';

const App = () => {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  return (
    <div className="App">
      {!roomId ? (
        <LoginRoom setRoomId={setRoomId} setPlayerName={setPlayerName} />
      ) : (
        <GameRoom roomId={roomId} playerName={playerName} />
      )}
    </div>
  );
};

export default App;
