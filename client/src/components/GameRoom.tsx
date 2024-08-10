import React, { useEffect, useState } from "react";
import socket from "../socket";
import Cards from "./Cards";
import "../App.css";
import Opponent from "./Opponent";

const GameRoom = ({ room, playerName }: { room: any; playerName: any }) => {
  const [gameState, setGameState] = useState<any>(room.gameState);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [playerHand, setPlayerHand] = useState<any>(
    room?.gameState?.players?.filter(
      (player: { name: any; }) => player.name === playerName
    )[0]?.hand ?? []
  );

  useEffect(() => {
    socket.on("updateGameState", (response: any) => {
      console.log(response);
      setGameState(response);
    });

    return () => {
      socket.off("updateGameState");
    };
  }, []);

  const playCard = (card: any) => {
    if (card) {
      socket.emit(
        "playCard",
        room.roomId,
        selectedCard,
        (response: { success: any; message: any }) => {
          if (response.success) {
            setSelectedCard(null); // Clear selected card after playing
          } else {
            alert(response.message);
          }
        }
      );
    } else {
      alert("Please select a card to play");
    }
  };

  const handleCardClick = (card: any) => {
    // Only allow card selection if it's the player's turn
    if (
      gameState &&
      gameState.players[gameState.currentPlayer].id === socket.id
    ) {
      setSelectedCard(card);
    } else {
      alert("It is not your turn");
    }
  };

  React.useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  return (
    <div className="room">
      <h3>Room ID: {room.roomId}</h3>

      <div className="table">
        <div className="deck">Deck</div>
        <div className="stack">
          <Cards number="5" color="red" />
        </div>
      </div>
      <div>
        <Opponent
          name={"Abhishek"}
          id={""}
          cards={[1, 2, 3, 4, 5, 6]}
          orientation={"vertical"}
          isCurrentPlayer={false}
          position={"left"}
        />
        <Opponent
          name={"Aniket"}
          id={""}
          cards={[1, 2, 3, 4, 5, 6]}
          orientation={"horizontal"}
          isCurrentPlayer={false}
          position={"top"}
        />
        <Opponent
          name={"Hritik"}
          id={""}
          cards={[1, 2, 3, 4, 5, 6]}
          orientation={"vertical"}
          isCurrentPlayer={false}
          position={"right"}
        />
      </div>
      <div className="playerPortal">
        <div className="hand">
          {playerHand.map((card: any, index: any) => (
            <Cards
              key={index}
              number={card.value}
              color={card.color}
              isWild={card.value === "wild"}
              onClick={() => playCard(card)}
            />
          ))}
          {/* <Cards number="5" color="red" onClick={playCard} />
          <Cards number="5" color="blue" onClick={playCard} />
          <Cards number="5" color="red" onClick={playCard} />
          <Cards number="5" color="blue" onClick={playCard} />
          <Cards number="5" color="green" onClick={playCard} />
          <Cards number="5" color="yellow" onClick={playCard} />
          <Cards number="Draw 4+" color="" isWild onClick={playCard} /> */}
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
