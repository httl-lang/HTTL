import React, { useState } from 'react';

import { UtilsContext, useUtilsModel } from './utils.model';
import * as s from './utils.styles';
import { HttlEditor, Viewer } from '../../../components/editor';

const _UtilsView: React.FC = () => {
  const model = useUtilsModel(({ decodeJwt, rawJwt, decodedJwt }) => ({ decodeJwt, rawJwt, decodedJwt }));

  return (
    <s.Container>
      <s.Panel style={{ flex: model.decodedJwt ? 1 : 0 }}>
        <s.Description>
        Paste a JWT token here to decode it.
        </s.Description>
        <s.EditPanel>
          <HttlEditor
            value={model.rawJwt}
            language='jwt'
            options={{
              overviewRulerLanes: 0,
              lineNumbers: 'off',
              lineDecorationsWidth: 0,
              glyphMargin: false,
              folding: false,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
            }}
            onChange={(script) => model.decodeJwt(script)}
          />
        </s.EditPanel>
        {
          model.decodedJwt && (
            <>
              <s.Description style={{ marginTop: '10px' }}>
                Decoded JWT
              </s.Description>
              <s.ViewPanel>
                <Viewer
                  value={model.decodedJwt || ''}
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
                  onChange={(script) => model.decodeJwt(script)}
                />
              </s.ViewPanel>
            </>
          )
        }

      </s.Panel>
    </s.Container>
  );
};

export const UtilsView = () => <UtilsContext><_UtilsView /></UtilsContext>;