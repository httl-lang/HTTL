import { FC } from 'react';
import { HttpResponse } from 'httl-core';

import { HttlResponseListContext, useHttlResponseListModel } from './httl-response-list.model';
import BiExpandVertical from "./expand.svg";

import * as s from './httl-response-list.styles';
import Toggle from '../../components/toggle';
import Popup from '../../components/popup';
import { HttlResponseListItem } from './httl-response-list-item';
import { MethodLabel } from '../../components/method-label';

export interface HttlResponseListProps {
  responses: HttpResponse[];
}

const HttlResponseList: FC = () => {
  const model = useHttlResponseListModel(({ currentResponse, responseItems, requestListExpanded, multipleResponses, highlightCode: highlightResponse, selectResponse, setExpanded }) =>
    ({ currentResponse, responseItems, requestListExpanded, multipleResponses, highlightResponse, selectResponse, setExpanded }));

  return (
    <s.Container>
      <s.CurrentResponse>
        <s.Request>
          <HttlResponseListItem response={model.currentResponse} showMultipleIndicator={model.multipleResponses} onClick={() => {
            model.highlightResponse(undefined, true);
          }} />
        </s.Request>
        {
          model.multipleResponses && (
            <Toggle toggled={model.requestListExpanded} onToggle={model.setExpanded}>
              <BiExpandVertical />
            </Toggle>
          )
        }

      </s.CurrentResponse>
      <Popup show={model.requestListExpanded} onClose={() => model.setExpanded(false)} style={{ top: 2 }}>
        <s.ResponseList>
          {
            model.responseItems.map((response, index) => (
              <s.DropDownItem key={index} onMouseEnter={() => model.highlightResponse(index)} onClick={() => model.selectResponse(index)}>
                {
                  response.source && <s.LineLabel>Line: {response.source.line + 1}</s.LineLabel>
                }
                <s.RequestTitle active={+response.active}>
                  <MethodLabel method={response.method} />
                  <s.ResUrl>{response.url}</s.ResUrl>
                </s.RequestTitle>
              </s.DropDownItem>))
          }
        </s.ResponseList>
      </Popup>
    </s.Container >
  );
};

export default (props: HttlResponseListProps) => <HttlResponseListContext {...props}><HttlResponseList /></HttlResponseListContext>;
