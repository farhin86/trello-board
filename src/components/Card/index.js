import React from "react";
import "./index.css";

export default function Card({ listId, cardData, deleteCard, onDragStart }) {
  const { title, id, desc, creationTime } = cardData;
  const date = new Date(creationTime);
  const formattedDate = new Intl.DateTimeFormat(["ban", "id"]).format(date);

  return (
    <div
      className="card-section"
      onDragStart={(e) => onDragStart(e, cardData, listId)}
      draggable
    >
      <div className="card-header">
        <div className="card-name">{title}</div>
        <div className="cross" onClick={() => deleteCard(id)}>
          x
        </div>
      </div>
      <div className="sub-title">{desc}</div>
      <div className="sub-title"> {formattedDate}</div>
    </div>
  );
}
