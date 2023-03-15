import React, { useState } from 'react';
import Button from './Button.svelte?svelte';

export default function App() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count => count + 1);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My app</title>
      </head>
      <body>
        <button onClick={increment}>React: {count}</button>
        <Button count={count} onClick={increment} />
      </body>
    </html>
  );
}
