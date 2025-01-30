import { FC } from 'react';
import { VscError } from "react-icons/vsc";

import { HttlDiagnostic } from 'httl-core';
import * as s from './errors.styles';


export interface HttlErrorsProps {
  errors: HttlDiagnostic[];
}

export const HttlErrors = ({ errors }: HttlErrorsProps) => {

  return (
    <s.ErrorView>
      {
        errors.length > 0 && (
          <s.Errors>
            {errors.map((error, index) => (
              <s.Error key={index} /*onClick={() => model.highlightCode(error.token, true)}*/>
                <VscError color='red' /> {error.error}
              </s.Error>
            ))}
          </s.Errors>
        )
      }
    </s.ErrorView>
  );
};

