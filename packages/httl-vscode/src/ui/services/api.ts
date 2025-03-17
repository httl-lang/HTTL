import uuidv4 from "../utils/uuidv4";

export abstract class Api {

  protected sendRequest(command: string, payload: any) {
    const requestId = uuidv4();
    const promise = new Promise<any>((resolve, reject) => {
      window.addEventListener('message', function listener(event) {
        if (event.data.command === command && event.data.requestId === requestId) {
          window.removeEventListener("message", listener, false);
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data.payload);
          }
        }
      }, false);
    });

    vscode.postMessage({
      command,
      requestId,
      payload
    });

    return promise;
  }
}