import { useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { HttlOutput } from 'httl-core';

import { HttlOutputContext, useHttlOutputModel } from './httl-output.model';

import * as s from './httl-output.styles';
import { HttlOutputResponse } from './httl-output-response';
import { HttlOutputError } from './httl-output-error';
import HttlResponseList from './httl-response-list';

export interface HttlOutputViewProps {
  inProgress: boolean | undefined;
  output?: HttlOutput;
}

const HttlOutputView = () => {
  const ref = useRef(null);
  const model = useHttlOutputModel(({ inProgress, currentResponse, errors, responses, selectResponse }) =>
    ({ inProgress, currentResponse, errors, responses, selectResponse }));

  useEffect(() => {
    if (model.inProgress) {
      // @ts-ignore
      ref.current?.continuousStart();
    } else {
      // @ts-ignore
      ref.current?.complete();
    }
  }, [model.inProgress]);


  return (
    <>
      <s.Loader>
        <LoadingBar ref={ref} color="#f1b019" shadow={true} />
      </s.Loader>

      <s.HttlOutputView>
        {
          model.errors?.length > 0
            ? <HttlOutputError errors={model.errors} />
            : null
        }
        {
          model.currentResponse
            ? (
              <>
                <s.ResponseList>
                  <HttlResponseList responses={model.responses} />
                </s.ResponseList>
                <s.Main>
                  <HttlOutputResponse response={model.currentResponse} />
                </s.Main>
              </>
            )
            : !model.inProgress
              ? <s.EmptyScript>No Requests to Process</s.EmptyScript>
              : null
        }
      </s.HttlOutputView>
    </>
  );
};

export default (props: HttlOutputViewProps) => <HttlOutputContext {...props}><HttlOutputView /></HttlOutputContext>;
