import * as React from 'react';

export interface ArbiterStasisProps {
  onError?(error: Error): void;
  renderError?(error: Error): React.ReactNode;
}

export interface ArbiterStasisState {
  error?: Error;
}

export class ArbiterStasis extends React.Component<ArbiterStasisProps, ArbiterStasisState> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  componentDidCatch(error: Error) {
    const { onError } = this.props;

    this.setState({
      error,
    });

    if (typeof onError === 'function') {
      onError(error);
    }
  }

  render() {
    const { children, renderError } = this.props;
    const { error } = this.state;

    if (error) {
      if (typeof renderError === 'function') {
        return renderError(error);
      }

      return <div style={{ whiteSpace: 'pre-wrap' }}>{error && error.message}</div>;
    }

    return children;
  }
}
