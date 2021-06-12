export const sortCards = (cardArray) => {
  cardArray.sort((a, b) => b.creationTime - a.creationTime);
};
