import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import * as Storage from './storage';
import DeckData from './deck-data';
import Link from 'next/link';



export default function DeckList() {
  const decks: DeckData[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('deck-')) {
      // @ts-ignore
      decks.push(Storage.getDeck(key));
    }
  }

  return (
    <>
      <h2>My decks</h2>
      {decks.length === 0 ? 'No decks' :
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Deck</TableCell>
                <TableCell align="right">Cards</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {decks.map((deck) => (
                <TableRow
                  key={deck.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link href={`/deck/${Storage.asDeckKey(deck.name)}`}>{deck.name}</Link>
                  </TableCell>
                  <TableCell align="right">{deck.cards.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </>
  );
}