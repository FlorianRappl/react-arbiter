import * as React from 'react';
import { isfunc } from '../utils';
import { StasisOptions } from '../types';

export interface ArbiterStasisProps extends StasisOptions {
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

    if (isfunc(onError)) {
      onError(error);
    }

    this.setState({
      error,
    });
  }

  render() {
    const { children, renderError, renderChild, renderProps } = this.props;
    const { error } = this.state;

    if (error) {
      if (isfunc(renderError)) {
        return renderError(error, renderProps);
      }

      return <div style={{ whiteSpace: 'pre-wrap' }}>{error && error.message}</div>;
    }

    return isfunc(renderChild) ? renderChild(children, renderProps) : children;
  }
}
