import React, { useState } from "react";
import socket from "../socket";
import UnoLogo from "../assets/Uno logo.png";
import "../App.css"

const LoginRoom = ({
  setRoom,
  setPlayerName,
}: {
  setRoom: any;
  setPlayerName: any;
}) => {
  const [roomKey, setRoomKeyState] = useState("");
  const [playerName, setPlayerNameState] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);

  const createRoom = () => {
    if (playerName) {
      socket.emit("createRoom", maxPlayers, playerName, (response: any) => {
        debugger
        setRoom(response.data);
        setPlayerName(playerName);
      });
    } else {
      alert("Please enter your name");
    }
  };

  const joinRoom = () => {
    if (playerName && roomKey) {
      socket.emit(
        "joinRoom",
        roomKey,
        playerName,
        (response: { success: any; message: any; data: any }) => {
          if (response.success) {
            setRoom(response.data);
            setPlayerName(playerName);
          } else {
            alert(response.message);
          }
        }
      );
    } else {
      alert("Please enter your name and room key");
    }
  };

  return (
    <div className="login">
      <img src={UnoLogo} alt="logo" className="logo"></img>
      <div className="form">
        <input
          type="text"
          placeholder="Enter your name"
          className="field"
          value={playerName}
          onChange={(e) => setPlayerNameState(e.target.value)}
        />
        <label>Players</label>
        <input
          type="number"
          min="2"
          max="4"
          className="field"
          style={{ width: "fit-content" }}
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(Number(e.target.value))}
        />
        <button onClick={createRoom} className="btn">Create Room</button>

        <div className="join">
          <input
            type="text"
            placeholder="Enter room key"
            className="field"
            value={roomKey}
            onChange={(e) => setRoomKeyState(e.target.value)}
          />
          <button onClick={joinRoom} className="btn">Join Room</button>
        </div>
      </div>
    </div>
  );
};

export default LoginRoom;
