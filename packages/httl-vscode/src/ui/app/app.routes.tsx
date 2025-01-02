import { createHashRouter, Navigate } from "react-router";

import { WelcomeView } from "../components/welcome";
import { MainView } from "./main";
import { ResponseView, HttlOutputView } from "./response";
import { TutorialsView } from "./main/tutorials";
import { QuickRunView } from "./main/quick-run";
import { UtilsView } from "./main/utils";

export const appRouter = createHashRouter([
  {
    path: '/',
    element: <Navigate to={(appData.view.startsWith('/') ? '' : '/') + appData.view} replace={true} />,
  },
  {
    path: '/main',
    element: <MainView />,
    children: [
      {
        index: true,
        element: <QuickRunView />,
      },
      {
        path: 'utils',
        element: <UtilsView />,
      },
      {
        path: 'tutorials',
        element: <TutorialsView />,
      },
    ],
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
  {
    path: '*',
    element: <Navigate to="/main" replace />,
  }
]);

