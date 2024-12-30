import { FC } from 'react';
import { VscError } from "react-icons/vsc";

import { HttlDiagnostic } from 'httl-core';
import * as s from './httl-output-error.styles';
import { useAppModel } from './app.model';

export interface HttlOutputErrorProps {
  errors: HttlDiagnostic[];
}

export const HttlOutputError: FC<HttlOutputErrorProps> = ({ errors }) => {
  const model = useAppModel(({ highlightCode }) => ({ highlightCode }));
  return (
    <s.ErrorView>
      {
        errors.length > 0 && (
          <s.Errors>
            {errors.map((error, index) => (
              <s.Error key={index} onClick={() => model.highlightCode(error.token, true)}>
                <VscError color='red' /> {error.error}
              </s.Error>
            ))}
          </s.Errors>
        )
      }
    </s.ErrorView>
  );
};

