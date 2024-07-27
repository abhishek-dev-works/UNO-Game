const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

let rooms = {};

const generateRoomKey = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const initializeGame = (roomId) => {
  const deck = createDeck();
  shuffleDeck(deck);

  rooms[roomId].deck = deck;
  rooms[roomId].players.forEach(player => {
    player.hand = drawCards(deck, 7);
  });
  rooms[roomId].currentCard = deck.pop();
  rooms[roomId].currentPlayer = 0;
};

const createDeck = () => {
  const colors = ['red', 'yellow', 'green', 'blue'];
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];
  const deck = [];
  colors.forEach(color => {
    values.forEach(value => {
      deck.push({ color, value });
      if (value !== '0') deck.push({ color, value });
    });
  });
  const wilds = ['wild', 'wildDraw4'];
  wilds.forEach(wild => {
    for (let i = 0; i < 4; i++) {
      deck.push({ color: 'wild', value: wild });
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

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('createRoom', (maxPlayers, callback) => {
    let roomId = generateRoomKey();
    while (rooms[roomId]) {
      roomId = generateRoomKey();
    }
    rooms[roomId] = { maxPlayers, players: [], gameState: null };
    initializeGame(roomId);
    socket.join(roomId);
    callback(roomId);
  });

  socket.on('joinRoom', (roomId, playerName, callback) => {
    const room = rooms[roomId];
    if (room) {
      if (room.players.length < room.maxPlayers) {
        const player = { id: socket.id, name: playerName, hand: [] };
        room.players.push(player);
        socket.join(roomId);
        io.in(roomId).emit('updateGameState', room);
        callback({ success: true, message: 'Joined room', gameState: room });
      } else {
        callback({ success: false, message: 'Room is full' });
      }
    } else {
      callback({ success: false, message: 'Room not found' });
    }
  });

  socket.on('playCard', (roomId, card, callback) => {
    const room = rooms[roomId];
    if (room) {
      const player = room.players.find(player => player.id === socket.id);
      if (player) {
        player.hand = player.hand.filter(c => !(c.color === card.color && c.value === card.value));
        room.currentCard = card;
        room.currentPlayer = (room.currentPlayer + 1) % room.players.length;
        io.in(roomId).emit('updateGameState', room);
        callback({ success: true, message: 'Card played', gameState: room });
      } else {
        callback({ success: false, message: 'Player not found in room' });
      }
    } else {
      callback({ success: false, message: 'Room not found' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    for (const roomId in rooms) {
      const room = rooms[roomId];
      room.players = room.players.filter(player => player.id !== socket.id);
      io.in(roomId).emit('updateGameState', room);
      if (room.players.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
