import { VscSparkle } from 'react-icons/vsc';
import * as s from './request-loading.styles';
import { Loader } from '../../../components/loader';

interface RequestLoadingProps {
  file?: string;
}

export const RequestLoading: React.FC<RequestLoadingProps> = ({ file }) => {
  return (
    <s.Container>
      <s.Icons>
        <s.HttlLogo />
      </s.Icons>
      <s.Message>
        Executing request... <Loader />
      </s.Message>
    </s.Container>
  );
};
