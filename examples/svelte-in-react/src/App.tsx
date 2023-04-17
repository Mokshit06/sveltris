import { useState } from 'react';
import svelteLogo from './assets/svelte.svg';
import reactLogo from './assets/react.svg';
import Button from './Button.svelte?in-react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="App">
      <div>
        <a href="https://svelte.dev" target="_blank" rel="noreferrer">
          <img src={svelteLogo} className="logo svelte" alt="Svelte Logo" />
        </a>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo" alt="Vite Logo" />
        </a>
      </div>
      <h1>Svelte in React</h1>

      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          react is {count}
        </button>
        <Button onClick={() => setCount(count => count + 1)}>
          svelte is {count}
        </Button>
      </div>

      <p>
        Check out{' '}
        <a
          href="https://github.com/mokshit06/sveltris#readme"
          target="_blank"
          rel="noreferrer"
        >
          Sveltris
        </a>
        , the library powering this magic.
      </p>
    </main>
  );
}

export default App;
