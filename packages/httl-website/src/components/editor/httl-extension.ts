'use client';
import { registerExtension  } from 'vscode/extensions'

export const initialize = async () => {

  // await initialize()

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
        }
      ],
      "grammars": [
        {
          "language": "httl",
          "scopeName": "source.httl",
          "path": "./grammars.json"
        }
      ],
      "commands": [
        {
          "command": "httl.run",
          "title": "Run HTTL File",
          "category": "HTTL",
          "icon": {
            "dark": "media/run.svg",
            "light": "media/run.svg"
          }
        }
      ],
      "keybindings": [
        {
          "command": "httl.run",
          "key": "f5",
          "when": "editorTextFocus && editorLangId == 'httl'"
        },
        {
          "command": "httl.run",
          "key": "ctrl+enter",
          "mac": "cmd+enter",
          "when": "editorTextFocus && editorLangId == 'httl'"
        }
      ],
    }
  }, 1) // ExtensionHostKind.LocalProcess is 1

  registerFileUrl('./grammars.json', new URL('./grammars.json', import.meta.url).toString())

  const vscode = await getApi()

  vscode.languages.setLanguageConfiguration("httl", {
    comments: { "lineComment": "#" },
    brackets: [["{", "}"], ["[", "]"], ["<", ">"]],
    autoClosingPairs: [
      { "open": "{", "close": "}" },
      { "open": "[", "close": "]" },
      { "open": "(", "close": ")" },
      { "open": "'", "close": "'" },
      { "open": "\"", "close": "\"" },
      { "open": "`", "close": "`" },
    ]
  });
}