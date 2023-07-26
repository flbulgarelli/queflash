'use client'
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

export function getDecks() {
  const decks: DeckData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('deck-')) {
      // @ts-ignore
      decks.push(getDeck(key));
    }
  }
  return decks;
}