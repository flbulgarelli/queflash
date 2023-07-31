import CardData from "./card-data";

export default interface DeckData {
  name: string;
  cards: CardData[];
  easies: CardData[];
  hards: CardData[];
}

export function makeDeck(name: string, cards: CardData[] = []) {
  return { name, cards, hards: [], easies: [] };
}