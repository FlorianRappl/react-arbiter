import * as React from 'react';
import { getDisplayName } from './helpers';
import { ArbiterRecall } from '../components';
import { ArbiterModule, ArbiterOptions } from '../types';

export interface RecallProps<TApi = {}> {
  loaded?: boolean;
  modules?: Array<ArbiterModule<TApi>>;
  error?: any;
}

export interface RecallHoc<TApi> {
  <TProps>(Component: React.ComponentType<TProps & RecallProps<TApi>>): React.ComponentType<TProps>;
}

/**
 * Creates a new recall HOC that can be easily composed.
 * @param options The options for setting up the recall.
 * @returns The HOC used for putting the component in a recall.
 */
export function createRecall<TApi>(options: ArbiterOptions<TApi>): RecallHoc<TApi> {
  return Component => withRecall(Component, options);
}

/**
 * Places a component inside a recall. The component is rendered once the recall
 * state is changed.
 * @param Component The component to render when the recall state changes.
 * @param options The options for setting up the recall.
 */
export function withRecall<TProps, TApi>(
  Component: React.ComponentType<TProps & RecallProps<TApi>>,
  options: ArbiterOptions<TApi>,
) {
  const Wrapper: React.ComponentType<TProps> = props => (
    <ArbiterRecall {...options}>
      {(loaded, modules, error) => <Component loaded={loaded} modules={modules} error={error} {...props} />}
    </ArbiterRecall>
  );
  Wrapper.displayName = `WithRecall(${getDisplayName(Component)})`;
  return Wrapper;
}
