import React from "react";
import WildBg from "../assets/WildBg.jpg";

const Cards = ({
  number,
  color,
  isWild,
}: {
  number: string;
  color: string;
  isWild?: boolean;
}) => {
  return (
    <div className="card" style={{ backgroundColor: isWild ? "black" : color }}>
      <div
        className="oval"
        style={{
          backgroundImage: isWild ? `url(${WildBg})` : "",
          backgroundSize: isWild ? "cover" : "",
          backgroundColor: isWild ? "" : "white",
        }}
      >
        <p
          className="cardNum"
          style={{
            color: isWild ? "black" : color,
            fontSize: isWild ? 30 : 80,
          }}
        >
          {number}
        </p>
      </div>
    </div>
  );
};

export default Cards;
