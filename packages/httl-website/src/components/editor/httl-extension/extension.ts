'use client';

import { registerExtension } from 'vscode/extensions'
import { HttlLanguageClient } from './httl-language-client';
import { HttlCommands } from './httl-commands';

let initialized = false;

export async function activate() {
  if (initialized) {
    throw new Error('Extension already activated');
  }

  initialized = true;

  const lspUrl = process.env.NEXT_PUBLIC_LSP_URL;
  const lspActivationUrl = process.env.NEXT_PUBLIC_LSP_ACTIVATION_URL;
  if (!lspUrl || !lspActivationUrl) {
    throw new Error('LSP URL or LSP Activation URL is not provided');
  }

  const extApi = await registerHttlConfig();

  const lsp = new HttlLanguageClient(lspUrl, lspActivationUrl, extApi);
  const commands = new HttlCommands(extApi, lsp);

  await lsp.start()

  return {
    client: lsp,
    commands,
  }
}

export interface HttlExtensionApi {
  client: HttlLanguageClient;
  commands: HttlCommands;
}

async function registerHttlConfig() {
  const { registerFileUrl, getApi, whenReady } = registerExtension({
    name: 'httl',
    publisher: 'httl',
    version: '1.0.0',
    engines: {
      vscode: '*'
    },
    "contributes": {
      "languages": [
        {
          "id": "httl",
          "aliases": [
            "HTTL",
            "Httl",
            "httl"
          ],
          "extensions": [
            ".httl"
          ],
          "configuration": "./language/configuration.json",
        }
      ],
      "grammars": [
        {
          "language": "httl",
          "scopeName": "source.httl",
          "path": "./language/grammars.json"
        }
      ],
      "commands": [
        {
          "command": "httl.run",
          "title": "Run HTTL File",
          "category": "HTTL",
        }
      ],
      "keybindings": [
        {
          "command": "httl.run",
          "key": "f5",
          "when": "editorLangId == 'httl'"
        },
        {
          "command": "httl.run",
          "key": "ctrl+enter",
          "mac": "cmd+enter",
          "when": "editorLangId == 'httl'"
        }
      ],
    }
  }, 1) // ExtensionHostKind.LocalProcess is 1

  registerFileUrl('./language/grammars.json', new URL('./language/grammars.json', import.meta.url).toString())
  registerFileUrl('./language/configuration.json', new URL('./language/configuration.json', import.meta.url).toString())

  await whenReady();

  return getApi();
}