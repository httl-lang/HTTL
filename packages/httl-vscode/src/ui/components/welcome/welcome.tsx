import * as s from './welcome.styles';
import Logo from '../logo';

export const WelcomeView = () => {
  return (
    <s.Container>
      <s.Icon>
        <Logo />
      </s.Icon>
      <s.Caption>
        Welcome to HTTL
      </s.Caption>
      <s.Message>
        HTTL (Hypertext Transfer Language) is a lightweight programming language designed to simplify and streamline HTTP calls.
      </s.Message>
    </s.Container>
  );
};
