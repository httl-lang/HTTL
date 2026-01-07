import { withLogging } from '@/lib/logging/with-logging';
import data from './data.json'

async function getHandler(request: Request) {
  return Response.json(data)
}

async function postHandler(request: Request) {
  const body = await request.json();
  return Response.json(body)
}

export const GET = withLogging(getHandler);
export const POST = withLogging(postHandler);
