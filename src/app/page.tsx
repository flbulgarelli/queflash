'use client'
import { useState } from 'react'
import Button from '@mui/material/Button';
import { cards } from './data';
import * as _ from 'lodash';

function Question({ value }: { value: string }) {
  return (
    <>
      {value.split(' ').map(it => it === '_' ? <span key='gap' className='fls-gap'>_</span> : <span key={it} className='fls-token'>{it}</span>)}
    </>
  )
}

function Card(props: {
  id: number,
  category: string,
  item: string,
  question: string,
  answer: string,
  onEasy: () => void,
  onHard: () => void
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article className='fls-card'>
      <section className='fls-category'>{props.category}</section>
      <section className='fls-id'>#{props.id}</section>
      <section className='fls-item'>{props.item}</section>
      <section className='fls-target'>{flipped ? props.answer : <Question value={props.question} />}</section>
      <section className='fls-actions'>
        {flipped ? <>
          <Button variant='outlined' color='success' onClick={props.onEasy}>Easy</Button>
          <Button variant='outlined' color='error' onClick={props.onHard}>Hard</Button>
        </>
          : <Button variant='outlined' onClick={() => setFlipped(true)}>Flip</Button>}
      </section>
    </article>
  )
}


type CardData = typeof cards[0];

function Deck(props: { cards: CardData[] }) {
  const [index, setIndex] = useState(0);
  const [isNew, setNew] = useState(true);

  const [easies, setEasies] = useState<CardData[]>([]);
  const [hards, setHards] = useState<CardData[]>([]);

  const currentDeck = isNew ? props.cards : hards;
  const currentCard = currentDeck[index];

  function next() {
    if (index === currentDeck.length - 1) {
      setIndex(0);
      setNew(false);
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
            if (isNew) {
              next();
            }
          }}
          onHard={() => {
            setEasies(remove(currentCard, easies));
            setHards(remove(currentCard, hards).concat([currentCard]));
            next();
          }}
        /> :
        <span>Done</span>}

      <section className='fls-counters'>
        <section className='fls-counter-current'>
          <span className='fls-easy'>{easies.length}</span> / <span className='fls-hard'>{hards.length}</span>
        </section>
        <section className='fls-counter-total'>
          <span className='fls-easy'>{easies.length + hards.length}</span> / <span className='fls-hard'>{props.cards.length}</span>
        </section>
      </section>
    </article>
  )
}

export default function Home() {
  return (
    <main>
      <Deck cards={cards.slice(0, 10)} />
    </main>
  )
}
