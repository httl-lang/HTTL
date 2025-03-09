import uuidv4 from "../utils/uuidv4";

export abstract class Api {

  protected sendRequest(command: string, payload: any) {
    const requestId = uuidv4();
    const promise = new Promise((resolve) => {
      window.addEventListener('message', function listener(event) {
        if (event.data.command === command && event.data.requestId === requestId) {
          window.removeEventListener("message", listener, false);
          resolve(event.data.payload);
        }
      }, false);
    });

    vscode.postMessage({
      command,
      requestId,
      payload: JSON.stringify(payload)
    });

    return promise;
  }
}