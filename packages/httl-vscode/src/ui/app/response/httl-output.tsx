import { FC, useEffect, useRef } from 'react';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import { HttlOutput } from 'httl-core';

import { HttlOutputContext, useHttlOutputModel } from './httl-output.model';

import * as s from './httl-output.styles';
import { HttlOutputResponse } from './httl-output-response';
import { HttlOutputError } from './httl-output-error';
import HttlResponseList from './httl-response-list';
import { useResponseModel } from './response.model';
import { RequestLoading } from './request-loading';

export interface HttlOutputViewProps {
  inProgress: boolean | undefined;
  output?: HttlOutput;
}

const _HttlOutputView: FC = () => {
  const ref = useRef<LoadingBarRef>(null);
  const model = useHttlOutputModel(({ inProgress, currentResponse, errors, responses, selectResponse }) =>
    ({ inProgress, currentResponse, errors, responses, selectResponse }));

  const resModel = useResponseModel(({ currentFile, highlightCode }) => ({ currentFile, highlightCode }));

  useEffect(() => {
    const indicator = ref.current;
    if (!indicator) {
      return;
    }

    if (model.inProgress) {
      ref.current.getProgress() > 0
        ? ref.current.continuousStart()
        : ref.current.start();
    } else {
      ref.current.getProgress() > 0 &&
        ref.current.complete();
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
                  <HttlOutputResponse
                    response={model.currentResponse}
                    source={resModel.currentFile!}
                    onSourceClick={() => resModel.highlightCode(model.currentResponse.source)}
                  />
                </s.Main>
              </>
            )
            : model.inProgress
              ? <RequestLoading file={resModel.currentFile} />
              : <s.EmptyScript>No Requests to Process</s.EmptyScript>
        }
      </s.HttlOutputView>
    </>
  );
};

export const HttlOutputView: FC = () => {
  const { viewData } = useResponseModel(({ viewData }) => ({ viewData }));

  if (!viewData) {
    return null;
  }

  return (
    <HttlOutputContext inProgress={viewData.inProgress} output={viewData.output}>
      <_HttlOutputView />
    </HttlOutputContext>
  );
};
