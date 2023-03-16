import React, { useState } from 'react';
import Button from './Button.svelte?svelte';
import View from './View.svelte?svelte';

function App() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count => count + 1);

  return (
    <View>
      <h1>Heading</h1>
      <Button count={count} onClick={increment}>
        <span>Click me</span>
      </Button>
    </View>
  );
}

export default function Root() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My app</title>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
