import { FC } from 'react';
// import Markdown from 'react-markdown';

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
      {/* <Markdown>
        {
          `### **New Release 0.1.8 🚀**

What's new: 
- [Support of HTTL 0.1.1](https://httl.dev/docs/release-notes#2025-02-25)

Bugfix:
- [IPv4 is now the default for requests to localhost](https://github.com/httl-lang/HTTL/issues/10)`
        }
      </Markdown> */}
    </s.NewsPopup>
  );
};

export default () => <NewsContext><News /></NewsContext>;
