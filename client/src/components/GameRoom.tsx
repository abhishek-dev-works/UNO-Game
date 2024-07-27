import React, { useEffect, useState } from 'react';
import socket from '../socket';

const GameRoom = ({ roomId, playerName }: { roomId: any, playerName: any }) => {
  const [gameState, setGameState] = useState<any>(null);

  useEffect(() => {
    socket.on('updateGameState', (state) => {
      setGameState(state);
    });

    return () => {
      socket.off('updateGameState');
    };
  }, []);

  const playCard = (card: any) => {
    socket.emit('playCard', roomId, card, (response: { success: any; message: any; }) => {
      if (!response.success) {
        alert(response.message);
      }
    });
  };

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      <h3>Player: {playerName}</h3>
      {gameState && (
        <div>
          <h4>Current Card: {gameState.currentCard.color} {gameState.currentCard.value}</h4>
          <div>
            <h5>Your Hand:</h5>
            {gameState.players.find((player: { name: any; }) => player.name === playerName)?.hand.map((card: { color: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
              <button key={index} onClick={() => playCard(card)}>
                {card.color} {card.value}
              </button>
            ))}
          </div>
          <h5>Players in Room:</h5>
          <ul>
            {gameState.players.map((player: { id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
