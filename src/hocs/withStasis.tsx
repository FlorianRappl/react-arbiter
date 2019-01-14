import * as React from 'react';
import { ArbiterStasis } from '../components';

export interface StasisProps {
  error?: Error;
}

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
