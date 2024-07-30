import React from "react";

const Cards = ({ number, color, isWild }: { number: string; color: string; isWild?: boolean }) => {
  return (
    <button
      style={{
        width: 130,
        height: 200,
        border: "2px solid black",
        backgroundColor: isWild ? 'black' : color,
        textAlign: "justify",
        fontSize: 80,
      }}
    >
      <div>
      <p
        style={{
          marginBlockStart: "3.2rem",
          textAlign: "center",
          fontFamily: "fantasy",
        }}
      >
        {!isWild ? number: "WILD"}
      </p>
      </div>
    </button>
  );
};

export default Cards;
