import { Model, connect } from "react-storm";
import { Example } from "./data";

@Model()
export class TutorialsModel {
  public init() { }

  public createExample(example: Example) {
    vscode.postMessage({
      command: 'create-example',
      payload: `# ${example.title}\n\n# ${example.description}\n${example.code}`
    });
  }
}

const [TutorialsContext, useTutorialsModel] = connect(TutorialsModel);

export { TutorialsContext, useTutorialsModel };