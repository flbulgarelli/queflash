'use client'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import * as Storage from './storage';
import DeckData from './deck-data';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DeckList() {
  const [decks, setDecks] = useState<DeckData[]>([]);

  useEffect(() => {
    setDecks(Storage.getDecks());
  }, []);

  return (
    <>
      <h2>My decks</h2>
      {decks.length === 0 ? 'No decks' :
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Deck</TableCell>
                <TableCell align="right">Total cards</TableCell>
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
                  <TableCell align="right">
                    {deck.cards.length} / <span className="fls-easy">{deck.easies.length}</span> / <span className="fls-hard">{deck.hards.length}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </>
  );
}