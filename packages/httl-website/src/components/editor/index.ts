'use client';

import dynamic from 'next/dynamic';

// import Editor from './editor';
// import { HttlEditor } from './httl-editor';

const Editor = dynamic(() => import('./httl-editor'), {
  ssr: false, // This is allowed in a client component
})

export default Editor;

