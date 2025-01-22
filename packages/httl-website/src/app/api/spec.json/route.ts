import data from './data.json'

export async function GET(request: Request) {
  data.servers[0].url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api'
      : 'https://httl.dev/api';
      
  return Response.json(data)
}