import React, { FC, useEffect, useRef } from 'react';
import { HttlOutput } from 'httl-core';

import { HttlResponse } from './response';
import { HttlErrors } from './errors';

import * as s from './response-viewer.styles';

export interface ResponseViewerProps {
  inProgress: boolean;
  output?: HttlOutput;
}

export const ResponseViewer = ({ inProgress, output }: ResponseViewerProps) => {

  if (!output)
    return null;

  return (
    <s.Container>
      {
        output.errors?.length > 0
          ? <HttlErrors errors={output.errors} />
          : null
      }
      {
        output.result?.length > 0
          ? (
            <s.Main>
              <HttlResponse response={output.result.at(-1)!} />
            </s.Main>
          )
          : !inProgress
            ? <s.EmptyScript>No Requests to Process</s.EmptyScript>
            : null
      }
    </s.Container>
  );
};

