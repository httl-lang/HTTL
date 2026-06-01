import {
  createConnection,
  ProposedFeatures,
  _Connection,
} from 'vscode-languageserver/node';

import {
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from 'vscode-ws-jsonrpc';

import { configureServer } from './configure-server';

export default class HttlLanguageServer {
  public readonly connection: _Connection;

  constructor(reader?: WebSocketMessageReader, writer?: WebSocketMessageWriter) {
    this.connection = createConnection(ProposedFeatures.all, reader, writer);
    configureServer(this.connection);

    process.on('SIGINT', () => {
      this.stop();
      process.exit(0);
    });
  }

  public start() {
    this.connection.listen();
  }

  public stop() {
    this.connection.dispose();
  }
}
