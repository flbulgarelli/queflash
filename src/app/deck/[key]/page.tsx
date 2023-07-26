"use client"
import { useEffect, useState } from "react"
import Button from "@mui/material/Button";
import { Breadcrumbs, Checkbox, FormControlLabel, FormGroup, Input, Switch, TextField, Typography } from "@mui/material";
import Link from "next/link";
import * as Storage from "@/app/storage";
import CardData, { getCardIds } from "@/app/card-data";
import { shuffle as shuffleArray } from "fast-shuffle";
import DeckData from "@/app/deck-data";
import { PlayCircle } from "@mui/icons-material";


function Question({ value }: { value: string }) {
  return (
    <>
      {value.split(" ").map(it => it === "_" ? <span key="gap" className="fls-gap">_</span> : <span key={it} className="fls-token">{it}</span>)}
    </>
  )
}

function Card(props: CardData & {
  onEasy: () => void,
  onHard: () => void
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article className="fls-card">
      <section className="fls-category">{props.category}</section>
      <section className="fls-id">#{props.id}</section>
      <section className="fls-item">{props.item}</section>
      <section className="fls-target">{flipped ? props.answer : <Question value={props.question} />}</section>
      <section className="fls-actions">
        {flipped ? <>
          <Button variant="outlined" color="success" onClick={props.onEasy}>Easy</Button>
          <Button variant="outlined" color="error" onClick={props.onHard}>Hard</Button>
        </>
          : <Button variant="outlined" onClick={() => setFlipped(true)}>Flip</Button>}
      </section>
    </article>
  )
}


function Deck(props: DeckData) {
  const [index, setIndex] = useState(0);

  const [easies, setEasies] = useState<CardData[]>(props.easies);
  const [hards, setHards] = useState<CardData[]>(props.hards);
  const [currentDeck, setCurrenDeck] = useState<CardData[]>(props.cards);

  const cardKeys = getCardIds(props.cards);

  const currentCard = currentDeck[index];

  useEffect(() => {
    Storage.updateDeckDifficulties(Storage.asDeckKey(props.name), easies, hards)
  }, [hards, easies]);

  function next() {
    if (index === currentDeck.length - 1) {
      setIndex(0);
      setCurrenDeck(hards.filter(it => cardKeys.includes(it.id)));
    } else {
      setIndex(index + 1);
    }
  }

  function remove(item: any, list: any[]) {
    return list.filter(it => it !== item)
  }

  return (
    <article>
      {currentCard ?
        <Card
          key={currentCard.id}
          id={currentCard.id}
          category={currentCard.category}
          item={currentCard.item}
          question={currentCard.question}
          answer={currentCard.answer}
          onEasy={() => {
            setHards(remove(currentCard, hards));
            setEasies(remove(currentCard, easies).concat([currentCard]));
            next();
          }}
          onHard={() => {
            setEasies(remove(currentCard, easies));
            setHards(remove(currentCard, hards).concat([currentCard]));
            next();
          }}
        /> :
        <span>Done</span>}

      <section className="fls-counters">
        <section className="fls-counter-current">
          <span className="fls-easy">{easies.length}</span> / <span className="fls-hard">{hards.length}</span>
        </section>
        <section className="fls-counter-total">
          <span className="fls-easy">{easies.length + hards.length}</span> / <span className="fls-hard">{props.cards.length}</span>
        </section>
      </section>
    </article>
  )
}

function DeckNavigator(props: DeckData) {
  const [navigating, setNavigating] = useState(false);
  const [cardsCount, setCardsCount] = useState(props.cards.length);
  const [shuffle, setShuffle] = useState(false);
  const [onlyHards, setOnlyHards] = useState(false);

  if (navigating) {
    let navigableCards = onlyHards ? props.hards : props.cards;

    if (shuffle) {
      navigableCards = shuffleArray(navigableCards);
    }

    navigableCards = navigableCards.slice(0, cardsCount);

    return (
      <>
        <h2>Deck {props.name}</h2>
        <Deck  {...props} cards={navigableCards} ></Deck>
      </>
    )
  } else {
    return (
      <>
        <h2>Configure deck navigation</h2>
        <FormGroup>
          <TextField id="outlined-number"
            label="Cards count"
            type="number"
            fullWidth
            variant="outlined"
            required
            value={cardsCount}
            onChange={(e) => setCardsCount(Number(e.target.value))} />

          <FormControlLabel control={<Switch onChange={(e) => setShuffle(e.target.checked)} />} label="Shuffle" />
          <FormControlLabel control={<Switch onChange={(e) => setOnlyHards(e.target.checked)} />} label="Only hards" />

          <Button startIcon={<PlayCircle />} size="medium" variant="outlined" onClick={() => setNavigating(true)}>Start</Button>
        </FormGroup>
      </>
    )
  }
}

export default function Page(props: { params: { key: string } }) {
  const deck = Storage.getDeck(props.params.key)!;

  return (
    <>
      <nav>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            QueFlash
          </Link>
          <Typography color="text.primary">Deck</Typography>
          <Typography color="text.primary">{deck.name}</Typography>

        </Breadcrumbs>
      </nav>
      <main>
        <DeckNavigator {...deck}></DeckNavigator>
      </main>
    </>
  )
}
