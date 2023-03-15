import express from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import React from 'react';
import App from './src/App';

const app = express();

app.use('/', express.static('./dist'));

app.get('/', (req, res) => {
  const { pipe } = renderToPipeableStream(React.createElement(App), {
    bootstrapModules: ['/index.js'],
    onShellReady() {
      res.setHeader('content-type', 'text/html');
      pipe(res);
    },
  });
});

app.listen(3000);
