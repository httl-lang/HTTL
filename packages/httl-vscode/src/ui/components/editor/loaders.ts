
import * as monaco from "monaco-editor";
import { CharacterPair } from "vscode";
import languageConfiguration from "../../../../language/configuration.json";

export function monacoInit(baseUri: string) {
  self.MonacoEnvironment = {
    baseUrl: `${baseUri}`,
    getWorker: function (moduleId, label: 'json' | 'css' | 'html' | 'typescript' | 'javascript' | 'default') {
      const workerContent = {
        json: `importScripts('${baseUri}/json.worker.js');`,
        css: `importScripts('${baseUri}/css.worker.js');`,
        html: `importScripts('${baseUri}/html.worker.js');`,
        typescript: `importScripts('${baseUri}/ts.worker.js');`,
        javascript: `importScripts('${baseUri}/ts.worker.js');`,
        default: `importScripts('${baseUri}/editor.worker.js');`,
      };

      const script = workerContent[label] || workerContent.default;

      return new Worker(URL.createObjectURL(new Blob(
        [script],
        { type: 'application/javascript' })
      ));
    },
  };
}

export async function jwtLangInit() {
  monaco.languages.register({ id: 'jwt' });

  monaco.languages.setMonarchTokensProvider('jwt', {
    tokenizer: {
      root: [
        [/^[^.]+\./, 'type.yaml'],  // Match header
        [/[^.]+\./, 'string'], // Match payload
        [/[^.]+$/, 'variable'], // Match signature
      ],
    },
  });
}

export async function httlLangInit(baseUri: string) {

  monaco.languages.register({ id: "httl", extensions: ['.httl'] });

  monaco.languages.setLanguageConfiguration("httl", {
    comments: languageConfiguration.comments,
    brackets: languageConfiguration.brackets as CharacterPair[],
    autoClosingPairs: [
      { "open": "{", "close": "}" },
      { "open": "[", "close": "]" },
      { "open": "(", "close": ")" },
      { "open": "'", "close": "'", "notIn": ["string", "comment"] },
      { "open": "\"", "close": "\"", "notIn": ["string"] },
      { "open": "`", "close": "`", "notIn": ["string", "comment"] },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  });

  monaco.languages.setMonarchTokensProvider('httl', {
    keywords: [
      'assert', 'as', 'use',
      'formdata', 'urlencoded', 'bin', 'raw',
      'true', 'false', 'null'
    ],
    tokenizer: {
      root: [
        // Comments
        [/#.*$/, 'comment'],

        // Request methods
        [/^\s*(get|post|put|delete|patch|head|options|connect|trace|lock|unlock|propfind|proppatch|copy|move|mkcol|mkcalendar|acl|search)\s+/, 'keyword'],

        // Extended HTTP syntax
        [/^(@)([^\s:]+\s*:)(.*)$/, ['keyword', 'variable', 'string']],
        [/^([^\s:]+\s*:)(.*)$/, ['variable', 'string']],

        // Keywords
        [/\b(assert|as|use)\b/, 'keyword.control'],
        [/\b(formdata|urlencoded|bin|raw)\b/, 'entity.name.function'],

        // Numbers
        [/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, 'number'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],  // Non-terminated string
        [/"/, 'string', '@string'],

        // Arrays
        [/\[/, 'delimiter.array', '@array'],

        // Objects
        [/\{/, 'delimiter.object', '@object'],

        // Constants
        [/\b(?:true|false|null)\b/, 'constant'],
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
      ],

      array: [
        [/\]/, 'delimiter.array', '@pop'],
        [/,/, 'delimiter.array'],
        { include: 'root' }
      ],

      object: [
        [/\}/, 'delimiter.object', '@pop'],
        [/:/, 'delimiter'],
        [/,/, 'delimiter'],
        { include: 'root' }
      ]
    }
  });
}