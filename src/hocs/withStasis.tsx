import * as React from 'react';
import { ArbiterStasis } from '../components';

export interface StasisProps {
  error?: Error;
}

/**
 * Creates a new stasis field that can be placed around components.
 * @param Component The component that is rendered in case of an error.
 * @param onError The optional callback when an error is emitted.
 */
export function withStasis<TProps>(
  Component: React.ComponentType<TProps & StasisProps>,
  onError?: (error: Error) => void,
): React.ComponentType<TProps> {
  return props => (
    <ArbiterStasis onError={onError} renderError={error => <Component error={error} {...props} children={undefined} />}>
      {props.children}
    </ArbiterStasis>
  );
}
