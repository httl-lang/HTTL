import { withLogging } from '@/lib/logging/with-logging';
import data from './data.json'

async function getHandler(request: Request) {
  data.servers[0].url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api'
      : 'https://httl.dev/api';

  return Response.json(data)
}

export const GET = withLogging(getHandler);
