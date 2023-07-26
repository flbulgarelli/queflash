'use client'
import { useEffect, useState } from 'react'
import { TextField, Button, Breadcrumbs, Typography, StyledEngineProvider, Box } from '@mui/material';
import DeckList from './deck-list';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Storage from './storage'
import CardData from './card-data';

export default function Page() {
  return (
    <>
      <nav>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            QueFlash
          </Link>
          <Typography color="text.primary">Home</Typography>
        </Breadcrumbs>
      </nav>
      <main className='fls-home-page'>
        <DeckLoader />
        <DeckList />
      </main>
    </>
  )
}

async function fetchSource(url: string)  : Promise<CardData[]> {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json") || url.endsWith(".json")) {
    return await response.json();
  } else if (contentType?.includes("text/csv") || url.endsWith(".csv")) {
    const text = await response.text();
    const lines = text.split('\n');
    const columnsCount = lines[0].split(",").length;

    if (columnsCount === 2) {
      return lines.slice(1).map((it, index) => {
        const [question, answer] = it.split(",");
        return {
          id: index,
          category: '',
          item: '',
          question,
          answer
        };
      })
    } else if (columnsCount === 3) {
      return lines.slice(1).map((it, index) => {
        const [category, question, answer] = it.split(",");
        return {
          id: index,
          category,
          item: '',
          question,
          answer
        };
      })
    } else {
      throw new Error("Unsupported CSV deck");
    }
  } else {
    throw new Error("Unsupported deck format " + contentType);
  }
}

function DeckLoader() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const router = useRouter();

  const deckKey = Storage.asDeckKey(name);

  function importSource() {
    fetchSource(url)
      .then(it => {
        Storage.setDeck(deckKey, {name, cards: it})
        router.push(`/deck/${deckKey}`);
      });
  }

  return (
    <Box component='form'>
      <h2>Load new deck</h2>

      <TextField
        size='small'
        fullWidth
        margin='dense'
        id="deck-name"
        label="Name"
        variant="outlined"
        required
        value={name}
        onChange={(e) => setName(e.target.value)} />
      <TextField
        size='small'
        fullWidth
        margin='dense'
        id="deck-url"
        label="URL"
        variant="outlined"
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)} />

      <Button size='medium' variant='outlined' onClick={importSource}>Go</Button>
    </Box>
  )
}
