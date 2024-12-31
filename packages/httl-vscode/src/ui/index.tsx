import ReactDOM from 'react-dom/client';

import App from './app';
import { editorInit } from './components/editor';

editorInit(appData.baseUri);

ReactDOM
  .createRoot(
    document.getElementById('root') as HTMLElement
  ).render(
    <App />
  );
