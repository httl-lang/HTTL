import { HttlOutput } from 'httl-core';
import { FindApiProjectsStepResult } from '../ai/agents/steps/find-api-projects-step';
import { FindApiControllersStepResult } from '../ai/agents/steps/find-api-controllers-step';
import { ControllerSpec } from '../ai/agents/project-agent';

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

interface AgentAnalysisEventMessage {
  command: 'agent-analysis-event';
  payload: { type: string, data: any };
}
export type AgentAnalysisEventPayload = Omit<AgentAnalysisEventMessage, 'command'>;

interface HighlightViewSectionMessage {
  command: 'highlight-section';
  payload: { panel: string, paths: string[] };
}
export type HighlightViewSectionMessagePayload = Omit<HighlightViewSectionMessage, 'command'>;

interface ReloadProjectMessage {
  command: 'reload-project';
  file: string;
}
export type ReloadProjectMessagePayload = Omit<ReloadProjectMessage, 'command'>;

export type UIMessage = InitializeMessage |
  ChangeActiveEditorMessage |
  CloseResponseMessage |
  SetResponseMessage |
  SetProgressMessage |
  AgentAnalysisEventMessage |
  HighlightViewSectionMessage |
  ReloadProjectMessage;

export type UIMessageType = UIMessage['command'];

