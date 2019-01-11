import { ComponentType } from 'react';

export interface ModuleMetadata {
  version: string;
  name: string;
  dependencies: {
    [name: string]: string;
  };
  content?: string;
  link?: string;
  hash: string;
}

export interface ModuleApp<TApi> {
  setup(portal: TApi): void;
}

export interface ModuleExports<TApi> {
  exports: ModuleApp<TApi> | undefined;
}

export type Module<TApi> = ModuleApp<TApi> & ModuleMetadata;

export interface DependencyFetcher {
  (url: string): Promise<string>;
}

export interface AvailableDependencies {
  [name: string]: any;
}

export interface RenderCallback<T> {
  (element: HTMLElement, props: T, ctx: any): void;
}

export interface ArbiterDisplay<TApi> {
  (loaded: boolean, modules: Array<Module<TApi>>, error?: any): React.ReactNode;
}

export interface ArbiterOptions<TApi> {
  createApi(target: ModuleMetadata): TApi;
  getModules(): Promise<Array<ModuleMetadata>>;
  modules?: Array<Module<TApi>>;
  fetchDependency?(url: string): Promise<string>;
  dependencies?: AvailableDependencies;
}

export type ComponentDefinition<T> = ComponentType<T> | RenderCallback<T>;
