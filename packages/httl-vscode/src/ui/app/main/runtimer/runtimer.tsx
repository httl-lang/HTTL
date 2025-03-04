import React from 'react';
import { VscClose } from "react-icons/vsc";

import { HttlEditor, Viewer } from '../../../components/editor';
import Button from '../../../components/button';

import { RuntimerContext, useRuntimerModel } from './runtimer.model';
import * as s from './runtimer.styles';
import RunSvg from './run.svg';

const _RuntimerView: React.FC = () => {
  const model = useRuntimerModel(({ run, data }) => ({ run, data }));

  return (
    <s.Container>
      <s.Panel>
        <s.Description>
          Runtimer
          <Button onClick={() => model.run()}>
            <RunSvg />
          </Button>
        </s.Description>
        <s.ViewPanel>
          <Viewer
            value={model.data || ''}
            language='json'
            options={{
              overviewRulerLanes: 0,
              lineNumbers: 'off',
              wordWrap: 'on',
              wrappingIndent: 'indent',
              lineDecorationsWidth: 0,
              glyphMargin: false,
              folding: false,
              scrollBeyondLastLine: false,
            }}
          />
        </s.ViewPanel>
      </s.Panel>
    </s.Container>
  );
};

export const RuntimerView = () => <RuntimerContext><_RuntimerView /></RuntimerContext>;