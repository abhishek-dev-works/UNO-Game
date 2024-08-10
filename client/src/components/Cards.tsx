import React from "react";
import WildBg from "../assets/WildBg.jpg";

const Cards = ({
  number,
  color,
  isWild,
  onClick = () => {},
}: {
  number: string;
  color: string;
  isWild?: boolean;
  onClick?: (props: any) => any;
}) => {
  return (
    <div className="card" style={{ backgroundColor: isWild ? "black" : color }} onClick={() =>onClick({color: color, value: number})}>
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
            fontSize: number.length > 1 ? 30 : 80,
          }}
        >
          {number}
        </p>
      </div>
    </div>
  );
};

export default Cards;
