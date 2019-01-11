import * as React from 'react';
import { ArbiterRecall } from '../components';
import { Module, ArbiterOptions } from '../types';

export interface RecallProps<TApi> {
  loaded?: boolean;
  modules?: Array<Module<TApi>>;
  error?: any;
}

export function withRecall<TProps, TApi>(
  Component: React.ComponentType<TProps & RecallProps<TApi>>,
  options: ArbiterOptions<TApi>,
) {
  return (props: TProps) => (
    <ArbiterRecall {...options}>
      {(loaded, modules, error) => <Component loaded={loaded} modules={modules} error={error} {...props} />}
    </ArbiterRecall>
  );
}
