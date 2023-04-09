import { useState } from 'react';
import Button from './Button.svelte?in-react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          react is {count}
        </button>
        <Button onClick={() => setCount(count => count + 1)}>
          svelte is {count}
        </Button>
      </div>
    </div>
  );
}

export default App;
