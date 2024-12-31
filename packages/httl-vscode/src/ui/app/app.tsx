import { RouterProvider } from "react-router";

import { AppContext } from "./app.model";
import { appRouter } from "./app.routes";
import * as s from "./app.styles";


const App = () => {
  return (
    <s.App>
      <RouterProvider router={appRouter} />
    </s.App>
  );
};

export default () => <AppContext><App /></AppContext>;