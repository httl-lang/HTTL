import { FC } from 'react';
import Markdown from 'react-markdown';

import { NewsContext, useNewsModel } from './news.model';

import * as s from './news.styles';

const News: FC = () => {
  const model = useNewsModel(({ show, aknowledgeReleaseNote }) =>
    ({ show, aknowledgeReleaseNote }));

  return (
    <s.NewsPopup
      show={model.show}
      closeOnEscape={false}
      showCloseButton={true}
      onClose={() => model.aknowledgeReleaseNote()}
    >
      <Markdown>
        {
          `### **New Release 0.1.7 🚀**

What's new: 
- [Added HTTL CLI](https://httl.dev/docs/cli)
- Added support for YAML OpenAPI spec

Bugfix:
- Fixed form data not being sent correctly`
        }
      </Markdown>
    </s.NewsPopup>
  );
};

export default () => <NewsContext><News /></NewsContext>;
