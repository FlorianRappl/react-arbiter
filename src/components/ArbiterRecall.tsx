import * as React from 'react';
import { setupModules, loadModules } from '../utils';
import { Module, ArbiterDisplay, ArbiterOptions } from '../types';

export interface ArbiterRecallProps<TApi> extends ArbiterOptions<TApi> {
  /**
   * The component to render when the modules have been loaded
   * (node instance) or with the state of the recall (function).
   */
  children?: React.ReactChild | ArbiterDisplay<TApi>;
}

export interface ArbiterState<TApi> {
  loaded: boolean;
  error?: any;
  modules: Array<Module<TApi>>;
}

/**
 * Represents an arbiter recall component to load extension components.
 */
export class ArbiterRecall<TApi> extends React.Component<ArbiterRecallProps<TApi>, ArbiterState<TApi>> {
  private mounted = false;

  constructor(props: ArbiterRecallProps<TApi>) {
    super(props);
    this.state = {
      loaded: false,
      modules: [],
    };
  }

  private finish(error: any, newModules: Array<Module<TApi>>) {
    const { createApi, modules: oldModules = [] } = this.props;

    this.setState({
      error,
      loaded: true,
      modules: setupModules(createApi, [...oldModules, ...newModules]),
    });
  }

  componentDidMount() {
    const { getModules, dependencies, fetchDependency } = this.props;
    this.mounted = true;

    loadModules(getModules, fetchDependency, dependencies).then(
      modules => this.mounted && this.finish(undefined, modules),
      error => this.mounted && this.finish(error, []),
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { children } = this.props;
    const { loaded, modules, error } = this.state;

    if (typeof children === 'function') {
      return (children as ArbiterDisplay<TApi>)(loaded, modules, error);
    } else if (loaded) {
      return children;
    }

    return false;
  }
}
