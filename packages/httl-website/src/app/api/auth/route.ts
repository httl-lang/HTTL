export const apiToken = 'WDBuWlWi7z';

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization')?.replace('Basic ', '');
  if (!authorization) {
    return Response.json({ error: 'Authorization header is required' }, { status: 400 });
  }

  const [username, password] = atob(authorization).split(':');

  if (username === 'admin' && password === 'admin') {
    return Response.json({ token: apiToken });
  }

  return Response.json({ error: 'Invalid credentials' }, { status: 401 });
}