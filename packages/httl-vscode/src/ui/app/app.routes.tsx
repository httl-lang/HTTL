import { createHashRouter, Navigate } from "react-router";

import { WelcomeView } from "../components/welcome";
import { MainView } from "./main";
import { ResponseView, HttlOutputView } from "./response";
import { TutorialsView } from "./main/tutorials";
import { QuickRunView } from "./main/quick-run";
import { UtilsView } from "./main/utils";
import { ProjectView } from "./main/project";
import { ErrorBoundary } from "../components/error-boundary";
import { NoRequestsYetView } from "./response/no-requests-yet";

export const appRouter = createHashRouter([
  {
    path: '/',
    element: <Navigate to={(appData.view.startsWith('/') ? '' : '/') + appData.view} replace={true} />,
  },
  {
    path: '/main',
    element: <MainView />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to='project' replace={true} />,
      },
      {
        path: 'project',
        element: <ProjectView />,
      },
      {
        path: 'quick-run',
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
      {
        path: '*',
        element: <Navigate to="/main/project" replace />,
      }
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
      {
        path: 'no-requests-yet',
        element: <NoRequestsYetView />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/main" replace />,
  }
]);

