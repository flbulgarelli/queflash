'use client'
import { useEffect, useState } from 'react'
import { TextField, Button, Breadcrumbs, Typography, StyledEngineProvider, Box } from '@mui/material';
import DeckList from './deck-list';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Storage from './storage'

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

function DeckLoader() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const router = useRouter();

  const deckKey = Storage.asDeckKey(name);

  function importSource() {
    fetch(url)
      .then(it => it.json())
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
