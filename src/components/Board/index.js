import React, { useState, useEffect } from "react";
import "./index.css";
import List from "../List";
import { sortCards } from "../../utils";
import { BoardItems } from "../../constants";

const LOCAL_STORAGE_KEY = "trelloData";

class ListItem {
  title = "";
  id = "";
  cardItems = [];
  constructor(title, id, cardItems) {
    this.title = title;
    this.id = id;
    this.cardItems = cardItems;
  }
}

function Board() {
  const [showListInput, setShowListInput] = useState(false);
  const [boardItems, setboardItems] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");

  useEffect(() => {
    const savedBoardData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedBoardData) {
      setboardItems(JSON.parse(savedBoardData));
    } else {
      setboardItems(BoardItems);
    }
  }, []);

  const saveTrelloToLocalStorage = (currentBoardItems) => {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(currentBoardItems)
    );
  };

  const setTrelloData = (trelloData) => {
    setboardItems(trelloData);
    saveTrelloToLocalStorage(trelloData);
  };

  const onCardDragStart = (event, startItem, listId) => {
    event.dataTransfer.setData(
      "cardInfo",
      JSON.stringify({ cardObj: startItem, removeFromListId: listId })
    );
  };

  const onListDrop = (event, dropId) => {
    const card = event.dataTransfer.getData("cardInfo");
    const { cardObj: selectedCard, removeFromListId: cardFromList } =
      JSON.parse(card);
    if (dropId === cardFromList) return;
    let updatedBoardItems = boardItems.map((eachList) => {
      if (eachList.id === dropId) {
        eachList.cardItems.push(selectedCard);
        sortCards(eachList.cardItems);
      }
      if (eachList.id === cardFromList) {
        const cards = eachList.cardItems.filter(
          (eachCard) => eachCard.id !== selectedCard.id
        );
        eachList.cardItems = cards;
      }
      return eachList;
    });
    setTrelloData(updatedBoardItems);
  };

  const listDragOver = (event) => {
    event.preventDefault();
  };

  const getListDeleted = (id) => {
    let updatedTrelloList = boardItems.filter((eachList) => eachList.id !== id);
    setTrelloData(updatedTrelloList);
  };

  const getCardDeleted = (cardId, listId) => {
    let updatedBoardItems = boardItems.map((eachList) => {
      if (eachList.id === listId) {
        const cards = eachList.cardItems.filter(
          (eachCard) => eachCard.id !== cardId
        );
        eachList.cardItems = cards;
        return eachList;
      }
      return eachList;
    });
    setTrelloData(updatedBoardItems);
  };

  const onAddList = () => {
    const newListObj = new ListItem(
      newListTitle,
      `${newListTitle}${boardItems.length + 1}`,
      []
    );
    setTrelloData([...boardItems, newListObj]);
    setNewListTitle("");
    setShowListInput(false);
  };

  const onCreateItem = (listId, cardDetails) => {
    let updatedBoardItems = boardItems.map((eachList) => {
      if (eachList.id === listId) {
        eachList.cardItems.push(cardDetails);
      }
      return eachList;
    });
    setTrelloData(updatedBoardItems);
  };

  const getAddListOptions = () => {
    return (
      <>
        <input
          autoFocus
          placeholder="Add list"
          onChange={(e) => setNewListTitle(e.target.value)}
        ></input>
        <div className="button-wrapper">
          <button onClick={() => setShowListInput(false)}>Cancel</button>
          <button disabled={newListTitle ? false : true} onClick={onAddList}>
            Add
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="board-wrapper">
      <div className="list-section">
        {boardItems.map((eachList, listIndex) => {
          return (
            <List
              key={`${eachList.id}-${listIndex}`}
              onDragStart={(e, startItem, listId) => {
                onCardDragStart(e, startItem, listId);
              }}
              onDragOver={(e) => listDragOver(e)}
              onDrop={(e, dropId) => onListDrop(e, dropId)}
              listData={eachList}
              deleteList={(id) => getListDeleted(id)}
              deleteCard={(cardId, listId) => getCardDeleted(cardId, listId)}
              onCreateItem={(listId, cardDetails) => {
                onCreateItem(listId, cardDetails);
              }}
            />
          );
        })}
      </div>
      <div className="add-list-section">
        {showListInput ? (
          getAddListOptions()
        ) : (
          <button onClick={() => setShowListInput(!showListInput)}>
            Add list
          </button>
        )}
      </div>
    </div>
  );
}

export default Board;
