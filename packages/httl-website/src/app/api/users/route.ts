import data from './data.json'

export async function GET(request: Request) {
  return Response.json(data)
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json(body)
}

