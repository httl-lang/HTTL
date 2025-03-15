import { HttlOutput } from 'httl-core';
import { FindApiProjectsStepResult } from '../ai/agents/steps/find-api-projects-step';
import { FindApiControllersStepResult } from '../ai/agents/steps/find-api-controllers-step';
import { ControllerSpec } from '../ai/agents/api-workspace-agent';

interface InitializeMessage {
  command: 'initialize';
}

interface ChangeActiveEditorMessage {
  command: 'change-active-editor';
  file?: string;
}
export type ChangeActiveEditorMessagePayload = Omit<ChangeActiveEditorMessage, 'command'>;

interface CloseResponseMessage {
  command: 'close-response';
  file: string;
}
export type CloseResponseMessagePayload = Omit<CloseResponseMessage, 'command'>;


interface SetResponseMessage {
  command: 'set-response';
  file: string;
  payload: HttlOutput;
}
export type SetResponsePayload = Omit<SetResponseMessage, 'command'>;

interface SetProgressMessage {
  command: 'set-progress';
  file: string;
  payload: boolean | undefined;
}
export type SetProgressMessagePayload = Omit<SetProgressMessage, 'command'>;

interface SetWorkspaceApiProjectsMessage {
  command: 'set-workspace-api-projects';
  payload: FindApiProjectsStepResult[];
}
export type SetWorkspaceApiProjectsPayload = Omit<SetWorkspaceApiProjectsMessage, 'command'>;


interface SetWorkspaceApiControllersMessage {
  command: 'set-workspace-api-controllers';
  payload: FindApiControllersStepResult[];
}
export type SetWorkspaceApiControllersPayload = Omit<SetWorkspaceApiControllersMessage, 'command'>;

interface SetWorkspaceApiControllerSpecMessage {
  command: 'set-workspace-api-controller-spec';
  payload: ControllerSpec;
}
export type SetWorkspaceApiControllerSpecPayload = Omit<SetWorkspaceApiControllerSpecMessage, 'command'>;

interface SetWorkspaceApiErrorMessage {
  command: 'set-workspace-api-error';
  payload: ControllerSpec;
}
export type SetWorkspaceApiErrorPayload = Omit<SetWorkspaceApiErrorMessage, 'command'>;


interface HighlightViewSectionMessage {
  command: 'highlight-section';
  payload: { panel: string, paths: string[] };
}
export type HighlightViewSectionMessagePayload = Omit<HighlightViewSectionMessage, 'command'>;


export type UIMessage = InitializeMessage |
  ChangeActiveEditorMessage |
  CloseResponseMessage |
  SetResponseMessage |
  SetProgressMessage |
  SetWorkspaceApiProjectsMessage |
  SetWorkspaceApiControllersMessage |
  SetWorkspaceApiControllerSpecMessage |
  SetWorkspaceApiErrorMessage |
  HighlightViewSectionMessage;

export type UIMessageType = UIMessage['command'];

