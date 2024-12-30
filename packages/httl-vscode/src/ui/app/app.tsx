import HttlOutputView from "./httl-output";
import { AppContext, useAppModel } from "./app.model";
import * as s from "./app.styles";
import WelcomeView from "./welcome-view";

const App = () => {
  const { viewData } = useAppModel(({ viewData }) => ({ viewData }));

  return (
    <s.App>
      {
        !!viewData
          ? <HttlOutputView inProgress={viewData.inProgress} output={viewData.output} />
          : <WelcomeView />
      }
    </s.App>
  );
};

export default () => <AppContext><App /></AppContext>;