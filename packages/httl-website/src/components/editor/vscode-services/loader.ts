'use client';

import "@codingame/monaco-vscode-theme-defaults-default-extension";

import { initServices } from 'monaco-languageclient/vscode/services';
import { ConsoleLogger } from 'monaco-languageclient/tools';
import { LogLevel } from 'vscode/services';

import "./workers";
import { getServiceOverrides } from "./services";
import { workspaceConfig } from "./settings";

let initialized = false;

export async function initialize() {
  if (initialized) {
    throw new Error('Already initialized');
  }

  initialized = true;

  const logger = new ConsoleLogger(LogLevel.Debug);
  await initServices({
    loadThemes: true,
    serviceOverrides: getServiceOverrides(),
    userConfiguration: {
      json: JSON.stringify(workspaceConfig)
    },
  }, {
    logger
  });
};