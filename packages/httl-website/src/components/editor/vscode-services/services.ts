'use client';

import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getTextMateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";

// export const useOpenEditorStub = async (modelRef: any, options: any, sideBySide: any) => {
//   console.log('Received open editor call with parameters: ', modelRef, options, sideBySide);
//   return undefined;
// };

export const getServiceOverrides = () => ({
  ...getConfigurationServiceOverride(),
  ...getTextMateServiceOverride(),
  ...getThemeServiceOverride(),
  ...getLanguagesServiceOverride(),
  ...getKeybindingsServiceOverride(),
  // ...getEditorServiceOverride(useOpenEditorStub),
  // ...getViewsServiceOverride(),
  // ...getWorkbenchServiceOverride(),
  // ...getFilesServiceOverride(),
});