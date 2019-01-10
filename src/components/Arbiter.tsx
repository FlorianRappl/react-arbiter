import * as React from 'react';
import { loadModule, setupModule, defaultFetchDependency } from '../utils';
import { Module, ModuleMetadata, AvailableDependencies } from '../types';

export interface ArbiterDisplay<TApi> {
  (loaded: boolean, modules: Array<Module<TApi>>, error?: any): React.ReactNode;
}

export interface ArbiterProps<TApi> {
  createApi(target: ModuleMetadata): TApi;
  getModules(): Promise<Array<ModuleMetadata>>;
  modules?: Array<Module<TApi>>;
  fetchDependency?(url: string): Promise<string>;
  dependencies?: AvailableDependencies;
  children?: React.ReactChild | ArbiterDisplay<TApi>;
}

export interface ArbiterState<TApi> {
  loaded: boolean;
  error?: any;
  modules: Array<Module<TApi>>;
}

export class Arbiter<TApi> extends React.Component<ArbiterProps<TApi>, ArbiterState<TApi>> {
  private mounted = false;

  constructor(props: ArbiterProps<TApi>) {
    super(props);
    this.state = {
      loaded: false,
      modules: [],
    };
  }

  private finish(modules: Array<Module<TApi>>, error: any) {
    const { createApi } = this.props;

    if (typeof createApi === 'function') {
      for (const app of modules) {
        const api = createApi(app);
        setupModule(app, api);
      }
    } else {
      console.warn('Invalid `createApi` prop. Skipping module installation.');
    }

    this.setState({
      loaded: true,
      error,
      modules,
    });
  }

  componentDidMount() {
    const { getModules, dependencies = {}, fetchDependency = defaultFetchDependency, modules = [] } = this.props;
    this.mounted = true;

    if (typeof getModules === 'function') {
      Promise.resolve(getModules())
        .then(moduleData => Promise.all(moduleData.map(m => loadModule<TApi>(m, fetchDependency, dependencies))))
        .then(newModules => this.mounted && this.finish([...newModules, ...modules], undefined))
        .catch(error => this.mounted && this.finish([], error));
    } else {
      console.error('Could not get the modules. Provide a valid `getModules` function as prop.');
    }
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

    return null;
  }
}
