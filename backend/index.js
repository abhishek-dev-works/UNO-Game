const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

// Use an array to store rooms
const rooms = [];

class Room {
  constructor(maxPlayers, roomId, gameState, players) {
    this.maxPlayers = maxPlayers;
    this.roomId = roomId;
    this.gameState = gameState;
    this.players = players;
  }
}

// Session middleware
const sessionMiddleware = session({
  secret: "your-secret-key", // Change this to a secure random string
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true if using https
});

app.use(sessionMiddleware);

const generateRoomKey = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const initializeGame = (roomId) => {
  const deck = createDeck();
  shuffleDeck(deck);

  const room = rooms.find((room) => room.roomId === roomId);
  room.deck = deck;
  room.players.forEach((player) => {
    player.hand = drawCards(deck, 7);
  });
  room.currentCard = deck.pop();
  room.currentPlayer = 0;
  room.gameState = {
    currentCard: room.currentCard,
    players: room.players,
  };
};

const createDeck = () => {
  const colors = ["red", "yellow", "green", "blue"];
  const values = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "skip",
    "reverse",
    "draw2",
  ];
  const deck = [];
  colors.forEach((color) => {
    values.forEach((value) => {
      deck.push({ color, value });
      if (value !== "0") deck.push({ color, value });
    });
  });
  const wilds = ["wild", "wildDraw4"];
  wilds.forEach((wild) => {
    for (let i = 0; i < 4; i++) {
      deck.push({ color: "wild", value: wild });
    }
  });
  return deck;
};

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};

const drawCards = (deck, count) => {
  return deck.splice(0, count);
};

const isCardPlayable = (currentCard, cardToPlay) => {
  return (
    currentCard.color === cardToPlay.color ||
    currentCard.value === cardToPlay.value ||
    cardToPlay.color === "wild"
  );
};

const formatResponse = (success, room) => {
  return {
    success,
    message: success ? "Event Successfull" : "Event Failed",
    data: room,
  };
};

io.use((socket, next) => {
  // Wrap the session middleware to work with socket.io
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("createRoom", (maxPlayers, playerName, callback) => {
    let roomId = generateRoomKey();
    const room = new Room(maxPlayers, roomId, null, []);
    const player = { id: socket.id, name: playerName, hand: [] };
    room.players.push(player);
    rooms.push(room);
    socket.join(roomId);
    initializeGame(roomId);
    callback(formatResponse(true, room));
  });

  socket.on("joinRoom", (roomId, playerName, callback) => {
    const room = rooms.find((room) => room.roomId === roomId);
    if (room) {
      if (room.players.length < room.maxPlayers) {
        const player = { id: socket.id, name: playerName, hand: [] };
        room.players.push(player);
        socket.join(roomId);
        // Initialize game if the room is full
        if (room.players.length === room.maxPlayers) {
          initializeGame(roomId);
        }
        io.in(roomId).emit("updateGameState", room.gameState);
        callback(formatResponse(true, room));
      } else {
        callback(formatResponse(false, room));
      }
    } else {
      callback(formatResponse(false, room));
    }
  });

  socket.on("playCard", (roomId, card, callback) => {
    const room = rooms.find((room) => room.roomId === roomId);
    if (room) {
      const player = room.players.find((player) => player.id === socket.id);
      if (player) {
        const currentCard = room.currentCard;
        if (isCardPlayable(currentCard, card)) {
          player.hand = player.hand.filter(
            (c) => !(c.color === card.color && c.value === card.value)
          );
          room.currentCard = card;
          room.currentPlayer = (room.currentPlayer + 1) % room.players.length;
          room.gameState = {
            currentCard: room.currentCard,
            players: room.players,
          };
          io.in(roomId).emit("updateGameState", room.gameState);
          callback({
            success: true,
            message: "Card played",
            gameState: room.gameState,
          });
        } else {
          callback({ success: false, message: "Card not playable" });
        }
      } else {
        callback({ success: false, message: "Player not found in room" });
      }
    } else {
      callback({ success: false, message: "Room not found" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      room.players = room.players.filter((player) => player.id !== socket.id);
      if (room.players.length === 0) {
        rooms.splice(i, 1);
        i--;
      } else {
        room.gameState = {
          currentCard: room.currentCard,
          players: room.players,
        };
        io.in(room.roomId).emit("updateGameState", room.gameState);
      }
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
