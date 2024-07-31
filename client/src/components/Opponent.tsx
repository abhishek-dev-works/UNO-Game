import React from "react";

interface IOpponentProps {
  name: string;
  id: string;
  cards: any[];
  orientation: "vertical" | "horizontal";
  isCurrentPlayer: boolean;
  position: "left" | "right" | "top";
}
const Opponent = (props: IOpponentProps) => {
  const { name, id, cards, orientation, isCurrentPlayer, position } = props;
  return (
    <div
      style={{
        position: "absolute",
        left: position == "left" ? 100 : position !== "right" ? "calc(100vw - 58%)" : "",
        top: position == "top" ? 100 : "25%",
        right: position == "right" ? 100 : "",
      }}
      id='opponent'
    >
      <div style={{ display: orientation == "horizontal" ? "flex" : "" , margin : 10, marginTop: 0 }}>
        {cards.map((card, ind) => {
          return (
            <div
              key={ind}
              className="oppCard"
              style={{
                width: 65,
                height: 85,
                marginLeft: orientation == "horizontal" ? "-20px" : "",
                marginTop: orientation == "vertical" ? "-50px" : "",
                transform: orientation == "vertical" ? "rotate(90deg)" : "",
              }}
            ></div>
          );
        })}
      </div>
      <div
    //    style={{
    //     position: "absolute",
    //     left: position == "left" ? 20 : "",
    //     top: position == "top" ? 0 : "25%",
    //     right: position == "right" ? 20 : "",
    //   }}
      >{name}</div>
    </div>
  );
};

export default Opponent;
