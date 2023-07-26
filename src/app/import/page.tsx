'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { importSource } from '../import-source';

export default function Page() {
  const { push } = useRouter();

  const searchParams = useSearchParams()

  const name = searchParams.get('name')!;
  const url = searchParams.get('url')!;
  const invert = searchParams.get('invert') === "true";

  useEffect(() => {
    importSource(name, url, invert).then(it => push(it));
  }, []);
}
