import ReactDOM from 'react-dom/client';

import App from './app';
import { monacoInit } from './components/editor';

monacoInit(appData.baseUri);

ReactDOM
  .createRoot(
    document.getElementById('root') as HTMLElement
  ).render(
    <App />
  );
