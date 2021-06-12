import React, { useState } from "react";
import "./index.css";
import Card from "../Card";

class Item {
  id = "";
  title = "";
  desc = "";
  creationTime = "";
  constructor(id, title, desc, creationTime) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.creationTime = creationTime;
  }
}

export default function List({
  listData,
  deleteList,
  deleteCard,
  onDragStart,
  onDragOver,
  onDrop,
  onCreateItem,
}) {
  const { title, id, cardItems = [] } = listData;
  const [showCardInput, setShowCardInput] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");

  const getCardDetails = () => {
    const cardDetails = new Item(
      `${title}Item${cardItems.length + 1}`,
      newCardTitle,
      newCardDesc,
      new Date().getTime()
    );
    onCreateItem(id, cardDetails);
    setNewCardTitle("");
    setNewCardDesc("");
    setShowCardInput(false);
  };

  const getAddCardOption = () => {
    return (
      <section>
        <input
          autoFocus
          placeholder="Add card title"
          onChange={(e) => setNewCardTitle(e.target.value)}
        ></input>
        <textarea
          className="desc"
          placeholder="Add description"
          onChange={(e) => setNewCardDesc(e.target.value)}
        ></textarea>
        <div className="button-wrapper">
          <button className="card-btn" onClick={() => setShowCardInput(false)}>
            Cancel
          </button>
          <button
            className="card-btn"
            disabled={newCardTitle && newCardDesc ? false : true}
            onClick={() => getCardDetails()}
          >
            Add
          </button>
        </div>
      </section>
    );
  };

  return (
    <div
      className="list-wrapper"
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, id)}
    >
      <section>
        <div className="list-header">
          <div className="list-name">{title}</div>
          <div className="cross" onClick={() => deleteList(id)}>
            x
          </div>
        </div>
        {cardItems.map((eachCard, cardIndex) => {
          return (
            <Card
              key={`${id}-${cardIndex}`}
              listId={id}
              onDragStart={onDragStart}
              cardData={eachCard}
              deleteCard={(cardID) => deleteCard(cardID, id)}
            />
          );
        })}
      </section>
      {showCardInput ? (
        getAddCardOption()
      ) : (
        <div className="add-card" onClick={() => setShowCardInput(true)}>
          +
        </div>
      )}
    </div>
  );
}
