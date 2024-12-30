import * as s from './welcome-view.styles';
import Examples from '../components/examples/examples';
import Logo from '../components/logo';

const WelcomeView = () => {
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
      <Examples />
    </s.Container>
  );
};

export default WelcomeView;
