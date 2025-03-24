import { VscSparkle } from 'react-icons/vsc';
import * as s from './no-requests-yet.styles';

export const NoRequestsYetView = () => {
  return (
    <s.Container>
      <s.Icons>
        <s.HttlLogo />
      </s.Icons>
      <s.Message>
        No responses yet.
      </s.Message>
      <s.SubMessage>
        Send your first request to see it here.
      </s.SubMessage>
    </s.Container>
  );
};
