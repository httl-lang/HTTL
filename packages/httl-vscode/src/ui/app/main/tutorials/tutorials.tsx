import { useCallback } from 'react';
import * as s from './tutorials.styles';
import { data, Example } from './data';
import { TutorialsContext, useTutorialsModel } from './tutorials.model';

const _TutorialsView = () => {
  const model = useTutorialsModel(({ createExample }) => ({ createExample }));

  const onClick = useCallback((example: Example) => {
    model.createExample(example);
  }, []);

  return (
    <s.Container>
      <s.Header>
        Tutorials
      </s.Header>
      <s.Grid>
        {
          data.map((example, i) => (
            <s.Tile key={i} onClick={() => onClick(example)}>
              <s.Caption>
                {example.title}
              </s.Caption>
              <s.Description>
                {example.description}
              </s.Description>
              <s.Code>
                {example.code}
              </s.Code>
            </s.Tile>
          ))
        }
      </s.Grid>
    </s.Container>
  );
};

export const TutorialsView = () => <TutorialsContext><_TutorialsView /></TutorialsContext>;
