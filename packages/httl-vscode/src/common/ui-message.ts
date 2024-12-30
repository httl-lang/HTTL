import { HttlOutput } from 'httl-core';

interface InitializeMessage {
  command: 'initialize';
}

interface ChangeActiveEditorMessage {
  command: 'change-active-editor';
  file: string;
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

export type UIMessage = InitializeMessage | ChangeActiveEditorMessage | CloseResponseMessage | SetResponseMessage | SetProgressMessage;

export type UIMessageType = UIMessage['command'];

