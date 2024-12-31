import { createHashRouter, Navigate } from "react-router";

import { WelcomeView } from "./welcome";
import { MainView } from "./main";
import { ResponseView, HttlOutputView } from "./response";

export const appRouter = createHashRouter([
  {
    path: '/',
    element: <Navigate to={`/${appData.view}`} replace={true} />,
  },
  {
    path: '/main',
    element: <MainView />,
  },
  {
    path: '/response',
    element: <ResponseView />,
    children: [
      {
        index: true,
        element: <WelcomeView />,
      },
      {
        path: ':editorPath',
        element: <HttlOutputView />,
      },
    ],
  },
]);
