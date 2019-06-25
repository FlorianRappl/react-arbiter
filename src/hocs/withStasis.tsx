import * as React from 'react';
import { getDisplayName } from './helpers';
import { ArbiterStasis } from '../components';

export interface StasisProps {
  error?: Error;
}

export interface StasisHoc {
  <TProps>(Component: React.ComponentType<TProps & StasisProps>): React.ComponentType<TProps>;
}

/**
 * Creates a new stasis HOC that can be easily composed.
 * @param onError The optional callback when an error is emitted.
 * @returns The HOC used for putting the component in a stasis.
 */
export function createStasis(onError?: (error: Error) => void): StasisHoc {
  return Component => withStasis(Component, onError);
}

/**
 * Creates a new stasis field that can be placed around components.
 * @param Component The component that is rendered in case of an error.
 * @param onError The optional callback when an error is emitted.
 */
export function withStasis<TProps>(
  Component: React.ComponentType<TProps & StasisProps>,
  onError?: (error: Error) => void,
) {
  const Wrapper: React.ComponentType<TProps> = props => (
    <ArbiterStasis onError={onError} renderError={error => <Component error={error} {...props} children={undefined} />}>
      {props.children}
    </ArbiterStasis>
  );
  Wrapper.displayName = `WithStasis(${getDisplayName(Component)})`;
  return Wrapper;
}
