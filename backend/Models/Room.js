class Room {
    constructor(maxPlayers, roomId) {
        this.maxPlayers = maxPlayers;
        this.roomId = roomId;
        this.gameState = null;
        this.players = [];
        this.deck = [];
        this.currentCard = null;
        this.currentPlayer = 0;
    }
}

module.exports = Room;
