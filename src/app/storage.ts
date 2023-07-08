import CardData from "./card-data";
import DeckData from "./deck-data";

export function asDeckKey(name: string) {
  return `deck-${name.toLowerCase().trim().replace(" ", "-")}`;
}

export function getDeck(deckKey: string) {
  const item = localStorage.getItem(deckKey);
  if (item) {
    return JSON.parse(item) as DeckData;
  }
}

export function setDeck(deckKey: string, deck: DeckData) {
  localStorage.setItem(deckKey, JSON.stringify(deck));
}