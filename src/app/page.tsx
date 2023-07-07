"use client"
import { useState } from 'react'
import Button from '@mui/material/Button';
import { cards } from './data';

function Question({ value }: { value: string }) {
  return (
    <>
      {value.split(" ").map(it => it === '_' ? <span key='gap' className='fls-gap'>_</span> : <span key={it} className='fls-token'>{it}</span>)}
    </>
  )
}

function Card(props: {
  category: string,
  item: string,
  question: string,
  answer: string,
  onEasy: () => void,
  onHard: () => void
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article className="fls-card">
      <section>{props.category}</section>
      <section className='fls-item'>{props.item}</section>
      <section className='fls-target'>{flipped ? props.answer : <Question value={props.question} />}</section>
      <section className='fls-actions'>
        {flipped ? <>
          <Button variant="outlined" onClick={props.onEasy}>Easy</Button>
          <Button variant="outlined" onClick={props.onHard}>Hard</Button>
        </>
          : <Button variant="outlined" onClick={() => setFlipped(true)}>Flip</Button>}
      </section>
    </article>
  )
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const [easyCount, setEasyCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);

  // const cards = [
  //   { category: 'Presente', item: 'Dizer', question: 'ela _', answer: 'ela diz' },
  //   { category: 'Presente', item: 'Dizer', question: 'eu _', answer: 'eu digo' },
  //   { category: 'Pretérito Perfeito', item: 'Dizer', question: 'eu _', answer: 'eu disse' },
  //   { category: 'Pretérito Perfeito', item: 'Dizer', question: 'ele _', answer: 'ele disse' },
  //   { category: 'Presente', item: 'Fazer', question: 'eu _', answer: 'eu faço' },
  //   { category: 'Presente', item: 'Fazer', question: 'você _', answer: 'você faz' },
  //   { category: 'Pretérito Perfeito', item: 'Fazer', question: 'você _', answer: 'você fez' }
  // ]

  const currentCard = cards[index % cards.length];

  return (
    <main>
      <Card
        key={index}
        category={currentCard.category}
        item={currentCard.item}
        question={currentCard.question}
        answer={currentCard.answer}
        onEasy={() => {
          setIndex(index + 1)
          setEasyCount(easyCount + 1);
        }}
        onHard={() => {
          setIndex(index + 1)
          setHardCount(hardCount + 1);
        }}
      />
      <section>
        <span>{easyCount}</span> / <span>{hardCount}</span>
      </section>
    </main>
  )
}
