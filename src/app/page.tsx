'use client'
import { useEffect, useState } from 'react'
import { TextField, Button, Breadcrumbs, Typography, StyledEngineProvider, Box, FormGroup, FormControlLabel, Switch, List, ListItem } from '@mui/material';
import DeckList from './deck-list';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Storage from './storage'
import CardData from './card-data';
import { AddCircle } from '@mui/icons-material';
import { importSource } from './import-source';

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
        <SampleDecks />
      </main>
    </>
  )
}

function SampleDecks() {
  const samples = [
    {name: 'Verbos Portugues', url: 'https://gist.githubusercontent.com/flbulgarelli/15aaf9059f87a1bd5b1a14a5e084710a/raw/34a6485b4b4ced8cec93e77070b481c3fd9863c4/verbos.pt.json', inverted: false},
    {name: 'Antonimos Portugues', url: 'https://gist.githubusercontent.com/flbulgarelli/15aaf9059f87a1bd5b1a14a5e084710a/raw/34a6485b4b4ced8cec93e77070b481c3fd9863c4/antonimos.pt.json', inverted: false},
    {name: 'Frases Portugues', url: 'https://gist.githubusercontent.com/flbulgarelli/15aaf9059f87a1bd5b1a14a5e084710a/raw/34a6485b4b4ced8cec93e77070b481c3fd9863c4/frases.pt.json', inverted: false},
    {name: 'Vocabulario Español-Portugues', url: 'https://gist.githubusercontent.com/flbulgarelli/cbf6dce967de061b23892cbd2ec18022/raw/585046f936b04c9ca0fb9b8272b05651b287c059/vocabulario.pt.csv', inverted: false},
    {name: 'Vocabulario Portugues-Español', url: 'https://gist.githubusercontent.com/flbulgarelli/cbf6dce967de061b23892cbd2ec18022/raw/585046f936b04c9ca0fb9b8272b05651b287c059/vocabulario.pt.csv', inverted: true},
  ]
  return (
    <>
    <h2>Sample decks</h2>
    <List>
      {samples.map((it, index) => <ListItem key={index}><Link href={`/import?name=${it.name}&inverted=${it.inverted}&url=${it.url}` }>{it.name}</Link></ListItem>)}
    </List>
    </>
  )
}


function DeckLoader() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [invert, setInvert] = useState(false);
  const router = useRouter();

  function importAndRedirect() {
    importSource(name, url, invert).then(it => router.push(it));
  }

  return (
    <FormGroup>
      <h2>Import new deck</h2>
      <TextField
        fullWidth
        placeholder='My deck'
        id="deck-name"
        label="Name"
        variant="outlined"
        required
        value={name}
        onChange={(e) => setName(e.target.value)} />
      <TextField
        fullWidth
        placeholder='http://mydeck.com/adeck.json'
        id="deck-url"
        label="URL"
        variant="outlined"
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)} />
      <FormControlLabel control={<Switch onChange={(e) => setInvert(e.target.checked)} />} label="Invert cards sides" />

      <Button startIcon={<AddCircle />} disabled={!name || !url}  variant='outlined' onClick={importAndRedirect}>Import</Button>
    </FormGroup>
  )
}
