import * as React from 'react';
import { ArbiterRecall } from '../components';
import { ArbiterModule, ArbiterOptions } from '../types';

export interface RecallProps<TApi = {}> {
  loaded?: boolean;
  modules?: Array<ArbiterModule<TApi>>;
  error?: any;
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
): React.ComponentType<TProps> {
  return props => (
    <ArbiterRecall {...options}>
      {(loaded, modules, error) => <Component loaded={loaded} modules={modules} error={error} {...props} />}
    </ArbiterRecall>
  );
}
