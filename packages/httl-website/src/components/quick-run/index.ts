'use client';

import dynamic from 'next/dynamic';

const QuickRun = dynamic(() => import('./quick-run'), {
  ssr: false,
})

export default QuickRun;


