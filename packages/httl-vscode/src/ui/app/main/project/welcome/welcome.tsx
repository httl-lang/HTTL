import { VscSparkle } from 'react-icons/vsc';
import * as s from './welcome.styles';

export const WelcomeView = () => {
  return (
    <s.Container>
      <s.Icons>
        <s.HttlLogo /> + <s.CopilotLogo />
      </s.Icons>
      <s.Caption>
        HTTL Project
      </s.Caption>
      <s.Message>
        Click <VscSparkle /> to let Copilot analyze your workspace and create an HTTL project.
      </s.Message>
      <s.SubMessage>
        Learn more about the HTTL Project in the <a href='https://httl.dev/docs/httl-project'>documentation</a>.
      </s.SubMessage>
    </s.Container>
  );
};
