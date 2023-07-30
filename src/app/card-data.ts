export default interface CardData {
  id: number,
  category: string,
  subcategory: string,
  question: string,
  answer: string,
};

export function getCardIds(cards: CardData[]) {
  return cards.map(it => it.id);
}


export function getCardsById(cards: CardData[], ids: number[]) {
  return cards.filter(it => ids.includes(it.id));
}