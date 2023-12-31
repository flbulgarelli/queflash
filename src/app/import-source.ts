import CardData from "./card-data";
import { makeDeck } from "./deck-data";
import * as Storage from "./storage";

async function fetchSource(url: string, invert: boolean)  {
  async function doFetch() : Promise<CardData[]> {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json") || url.endsWith(".json")) {
      return await response.json();
    } else if (contentType?.includes("text/csv") || url.endsWith(".csv")) {
      const text = await response.text();
      const lines = text.split('\n');
      const columnsCount = lines[0].split(",").length;
      let parseLine: (line: string, id: number) => CardData;

      if (columnsCount === 2) {
        parseLine = (it, id) => {
          const [question, answer] = it.split(",");
          return { id, category: '', subcategory: '', question, answer };
        }
      } else if (columnsCount === 3) {
        parseLine = (it, id) => {
          const [category, question, answer] = it.split(",");
          return { id, category, subcategory: '', question, answer };
        }
      } else if (columnsCount === 4) {
        parseLine = (it, id) => {
          const [category, subcategory, question, answer] = it.split(",");
          return { id, category, subcategory, question, answer };
        }
      } else {
        throw new Error("Unsupported CSV deck");
      }

      return lines.slice(1).map((it, index) => parseLine(it, index));
    } else {
      throw new Error("Unsupported deck format " + contentType);
    }
  }

  const response = await doFetch();

  if (invert) {
    response.forEach(it => {
      const answer = it.answer;
      it.answer = it.question;
      it.question = answer;
    });
  }

  return response;
}

export async function importSource(name: string, url: string, invert: boolean) {
  const deckKey = Storage.asDeckKey(name);
  const cards = await fetchSource(url, invert);
  Storage.setDeck(deckKey, makeDeck(name, cards));
  return `/deck/${deckKey}`;
}
