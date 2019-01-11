import * as React from 'react';
import { ArbiterStasis } from '../components';

export interface StasisProps {
  error?: Error;
}

export function withStasis<TProps>(
  Component: React.ComponentType<TProps & StasisProps>,
  onError?: (error: Error) => void,
) {
  return (props: TProps & { children?: React.ReactNode }) => (
    <ArbiterStasis onError={onError} renderError={error => <Component error={error} {...props} children={undefined} />}>
      {props.children}
    </ArbiterStasis>
  );
}
