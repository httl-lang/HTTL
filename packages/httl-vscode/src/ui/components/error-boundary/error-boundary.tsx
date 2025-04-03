import { useMemo } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import ReactDOMServer from "react-dom/server";
import { VscClose } from "react-icons/vsc";

import { useAppModel } from "../../app/app.model";
import * as s from "./error-boundary.styles";

export function ErrorBoundary() {
  const error = useRouteError();
  const model = useAppModel(({ clearAppState, goHome }) => ({ clearAppState, goHome }));

  const errorDetails = useMemo(() => {
    if (isRouteErrorResponse(error)) {
      return (
        <>
          <h2>{error.status}</h2>
          <p>{error.statusText}</p>
          {error.data?.message && <p>{error.data.message}</p>}
        </>
      );
    }

    if (error instanceof Error) {
      return (
        <>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </>
      );
    }

    return <>{(error as any).toString()}</>;
  }, [error]);

  const errorGithubDetails = useMemo(() => {
    return encodeURIComponent(
      ReactDOMServer.renderToStaticMarkup(errorDetails)
    );
  }, [errorDetails]);

  return (
    <s.Container>
      <s.CloseButton onClick={() => model.goHome()} >
        <VscClose />
      </s.CloseButton>
      <s.Icons>
        <s.HttlLogo />
      </s.Icons>
      <s.Caption>
        Error :(
      </s.Caption>
      <s.Message>
        An error occurred while rendering the view.
      </s.Message>
      <s.Details>
        {errorDetails}
      </s.Details>
      <s.SubMessage>
        What you can do:
        <ul>
          <li>Try to <a href='#' onClick={() => model.clearAppState()}>clear the cache</a>. <strong>!!! Please be aware: this will delete a query in the Quick-Run panel. !!!</strong></li>
          <li>Report this issue by <a href={`https://github.com/httl-lang/HTTL/issues/new?title=vscode:ui:issue&body=${errorGithubDetails}`}>creating a new GitHub issue</a>.</li>
        </ul>
      </s.SubMessage>
    </s.Container >
  );
}

