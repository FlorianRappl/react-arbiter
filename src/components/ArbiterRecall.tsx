import * as React from 'react';
import { createModules, loadModules, isfunc } from '../utils';
import { ArbiterModule, ArbiterDisplay, ArbiterOptions } from '../types';

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
  modules: Array<ArbiterModule<TApi>>;
}

/**
 * Represents an arbiter recall component to load extension components.
 */
export class ArbiterRecall<TApi> extends React.Component<ArbiterRecallProps<TApi>, ArbiterState<TApi>> {
  private mounted = false;

  constructor(props: ArbiterRecallProps<TApi>) {
    super(props);
    this.state = {
      loaded: props.async || false,
      modules: [],
    };
  }

  private finish(error: any, newModules: Array<ArbiterModule<TApi>>) {
    const { createApi, modules: oldModules = [] } = this.props;

    for (const oldModule of oldModules) {
      const [newModule] = newModules.filter(m => m.name === oldModule.name);

      if (newModule) {
        newModules.splice(newModules.indexOf(newModule), 1);
      }
    }

    this.setState({
      error,
      loaded: true,
      modules: createModules(createApi, [...oldModules, ...newModules]),
    });
  }

  componentDidMount() {
    const { fetchModules, dependencies, getDependencies, fetchDependency, cache } = this.props;
    this.mounted = true;

    if (isfunc(fetchModules)) {
      loadModules(fetchModules, fetchDependency, dependencies, getDependencies, cache).then(
        modules => this.mounted && this.finish(undefined, modules),
        error => this.mounted && this.finish(error, []),
      );
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { children } = this.props;
    const { loaded, modules, error } = this.state;

    if (isfunc(children)) {
      return (children as ArbiterDisplay<TApi>)(loaded, modules, error);
    } else if (loaded) {
      return children;
    }

    return false;
  }
}
