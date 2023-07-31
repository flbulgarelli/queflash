'use client'
import CardData, { getCardIds, getCardsById } from "./card-data";
import DeckData from "./deck-data";

export function asDeckKey(name: string) {
  return `deck-${encodeURIComponent(name.toLowerCase().trim().replace(" ", "-"))}`;
}

export function getDeck(deckKey: string) {
  const item = localStorage.getItem(deckKey);
  if (item) {
    const jsonDeck = JSON.parse(item);
    jsonDeck.easies = getCardsById(jsonDeck.cards, jsonDeck.easies ?? []);
    jsonDeck.hards = getCardsById(jsonDeck.cards, jsonDeck.hards ?? []);
    return jsonDeck as DeckData;
  }
}

export function setDeck(deckKey: string, deck: DeckData) {
  localStorage.setItem(deckKey, JSON.stringify({
    name: deck.name,
    cards: deck.cards,
    easies: getCardIds(deck.easies),
    hards: getCardIds(deck.hards)
  }));
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

export function updateDeckDifficulties(deckKey: string, easies: CardData[], hards: CardData[]) {
  const deck = getDeck(deckKey)!;
  deck.easies = easies;
  deck.hards = hards;
  setDeck(deckKey, deck);
}
