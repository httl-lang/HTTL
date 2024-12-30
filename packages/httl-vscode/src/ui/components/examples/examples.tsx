import { useCallback, useState } from 'react';
import * as s from './examples.styles';
import { useAppModel } from '../../app/app.model';
import { data, Example } from './data';

const Examples = () => {
  const [showFade, setShowFade] = useState(true);
  const model = useAppModel(({ createExample }) => ({ createExample }));

  const onClick = useCallback((example: Example) => {
    model.createExample(example);
  }, []);

  return (
    <s.Container>
      <s.SectionName>
        Examples
      </s.SectionName>
      <s.Grid showFade={showFade} onScroll={(e) => setShowFade(false)}>
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

export default Examples;
