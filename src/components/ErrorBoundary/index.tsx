import React, { ErrorInfo, ReactNode } from "react";
import { logger } from "../../utils/logger";
import { Card } from "@blueprintjs/core";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

// https://nextjs.org/docs/pages/building-your-application/configuring/error-handling
class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(JSON.stringify({ error, errorInfo }));
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Card>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
