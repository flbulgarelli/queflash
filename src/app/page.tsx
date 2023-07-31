'use client'
import { useEffect, useState } from 'react'
import { TextField, Button, Breadcrumbs, Typography, StyledEngineProvider, Box, FormGroup, FormControlLabel, Switch, List, ListItem } from '@mui/material';
import DeckList from './deck-list';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    { name: 'Verbos Português', url: 'https://gist.githubusercontent.com/flbulgarelli/15aaf9059f87a1bd5b1a14a5e084710a/raw/3658ae64c06d74799839e46bcec03be72e6a708a/verbos.pt.json', inverted: false },
    { name: 'Antônimos Português', url: 'https://gist.githubusercontent.com/flbulgarelli/548cb7371883393570b258cdac4c6e63/raw/90320a173158fc4bc7090073d3db520725ed7602/antonimos.pt.csv', inverted: false },
    { name: 'Frases Português', url: 'https://gist.githubusercontent.com/flbulgarelli/64a5cf9a5a0ca7e1cdfe6b7bcc790da2/raw/f0400e879299e9c1aa88fd68e276f90f0fca201d/frases.pt.csv', inverted: false },
    { name: 'Vocabulário Español-Português', url: 'https://gist.githubusercontent.com/flbulgarelli/cbf6dce967de061b23892cbd2ec18022/raw/2a1d22509d87b27f1ad9f0cbf3b78bbcaf7f4468/vocabulario.pt.csv', inverted: false },
    { name: 'Vocabulário Português-Español', url: 'https://gist.githubusercontent.com/flbulgarelli/cbf6dce967de061b23892cbd2ec18022/raw/2a1d22509d87b27f1ad9f0cbf3b78bbcaf7f4468/vocabulario.pt.csv', inverted: true },
  ]
  return (
    <>
      <h2>Sample decks</h2>
      <List>
        {samples.map((it, index) =>
          <ListItem key={index}>
            <Button href={`./import?name=${it.name}&inverted=${it.inverted}&url=${it.url}`} startIcon={<AddCircle/>}>{it.name}</Button>
          </ListItem>)
        }
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

      <Button startIcon={<AddCircle />} disabled={!name || !url} variant='outlined' onClick={importAndRedirect}>Import</Button>
    </FormGroup>
  )
}
