import { withLogging } from '@/lib/logging/with-logging';
import { apiToken } from '../../_constants';
import data from '../data.json'

async function getHandler(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const userId = (await params).id
  const user = data.find(x => x.id === +userId);
  if (user === undefined) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json(user)
}

async function putHandler(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const authorization = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!authorization) {
    return Response.json({ error: 'Authorization header is required' }, { status: 400 });
  }
  if (authorization !== apiToken) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }

  const userId = (await params).id
  const user = data.find(x => x.id === +userId);
  if (user === undefined) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  const body = await request.json();

  return Response.json({ ...user, ...body })
}

async function deleteHandler(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const userId = (await params).id
  const user = data.find(x => x.id === +userId);
  if (user === undefined) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json({ message: 'User deleted' })
}

export const GET = withLogging(getHandler);
export const PUT = withLogging(putHandler);
export const DELETE = withLogging(deleteHandler);
