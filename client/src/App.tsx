import React, { useState } from 'react';
import LoginRoom from './components/LoginRoom';
import GameRoom from './components/GameRoom';

const App = () => {
  const [room, setRoom] = useState<any>(null);
  const [playerName, setPlayerName] = useState('');

  return (
    <div className="App">
      {!room ? (
        <LoginRoom setRoom={setRoom} setPlayerName={setPlayerName} />
      ) : (
        <GameRoom room={room} playerName={playerName} />
      )}
    </div>
  );
};

export default App;
