import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket } from 'net'
import type { Server as HTTPServer } from 'http'
import { WebSocketServer } from 'ws';
import HttlLanguageServer from 'httl-lsp';

import {
  IWebSocket,
  WebSocketMessageReader,
  WebSocketMessageWriter,
  toSocket
} from 'vscode-ws-jsonrpc';

interface SocketWithServer extends Socket {
  server?: HTTPServer & {
    wss?: WebSocketServer
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socket = res.socket as SocketWithServer

  if (socket.server && socket.server.wss) {
    console.log('WebSocket Server is already running')
    res.end()
    return
  }

  console.log('Initializing WebSocket Server...')
  const wss = new WebSocketServer({ server: socket.server, path: '/lsp' });

  wss.on('connection', (ws: IWebSocket) => {
    const socket = toSocket(ws as any);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);

    const server = new HttlLanguageServer(reader, writer);
    server.start();
  });

  if (socket.server) {
    socket.server.wss = wss
  }

  res.end()
}