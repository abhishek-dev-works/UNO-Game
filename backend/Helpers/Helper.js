const { colors, values } = require("../Constants/Constants");
const generateRoomKey = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const createDeck = () => {
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