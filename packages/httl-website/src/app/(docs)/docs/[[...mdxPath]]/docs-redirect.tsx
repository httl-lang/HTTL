'use client';

import { useEffect } from 'react';

/**
 * Client-side redirect used for the bare `/docs` path. The site is statically
 * exported, so a server `redirect()` is not available at request time; this
 * renders a valid static page that bounces to the landing doc on load (works on
 * any static host, independent of Cloudflare `_redirects`).
 */
export function DocsRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <p style={{ padding: '2rem' }}>
      Redirecting to <a href={to}>{to}</a>…
    </p>
  );
}
