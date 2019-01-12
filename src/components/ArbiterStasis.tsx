import * as React from 'react';

export interface ArbiterStasisProps {
  /**
   * Event emitted in case of an error.
   */
  onError?(error: Error): void;
  /**
   * Place a renderer here to customize the error output.
   */
  renderError?(error: Error): React.ReactNode;
  /**
   * The children to be placed in the stasis field.
   */
  children?: React.ReactNode;
}

export interface ArbiterStasisState {
  error?: Error;
}

/**
 * Represents an arbiter stasis component to prevent extension components
 * from crashing the system. Shows an (optionally custom) error instead.
 */
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
