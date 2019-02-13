import { ComponentType } from 'react';

export interface ArbiterModuleMetadata {
  version: string;
  name: string;
  dependencies: {
    [name: string]: string;
  };
  content?: string;
  link?: string;
  hash: string;
}

export interface ArbiterModuleApp<TApi> {
  setup(portal: TApi): void;
}

export interface ArbiterModuleExports<TApi> {
  exports: ArbiterModuleApp<TApi> | undefined;
}

export type ArbiterModule<TApi> = ArbiterModuleApp<TApi> & ArbiterModuleMetadata;

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
  (loaded: boolean, modules: Array<ArbiterModule<TApi>>, error?: any): React.ReactNode;
}

export interface StasisOptions {
  /**
   * Event emitted in case of an error.
   */
  onError?(error: Error): void;
  /**
   * Place a renderer here to customize the error output.
   */
  renderError?(error: Error): React.ReactNode;
}

export interface WrapOptions<T, K extends keyof T> extends StasisOptions {
  /**
   * The optional props to be forwarded (i.e., captured) to the wrapped
   * component.
   */
  forwardProps?: Pick<T, K>;
  /**
   * The optional contextTypes to consider for wrapping foreign components.
   */
  contextTypes?: Array<string>;
}

export interface ArbiterOptions<TApi> {
  /**
   * Creates an API for the given raw module.
   * @param target The raw (meta) content of the module.
   * @returns The API object to be used with the module.
   */
  createApi(target: ArbiterModuleMetadata): TApi;
  /**
   * Gets the raw modules from (e.g., a server) asynchronously.
   * @returns The promise yielding an array of raw modules.
   */
  fetchModules(): Promise<Array<ArbiterModuleMetadata>>;
  /**
   * Optionally, some already existing evaluated modules, e.g.,
   * helpful when debugging.
   * @returns An array of evaluated modules.
   */
  modules?: Array<ArbiterModule<TApi>>;
  /**
   * Defines how other dependencies are fetched.
   * @param url The URL to the dependency that should be fetched.
   * @returns The promise yielding the dependency's content.
   */
  fetchDependency?(url: string): Promise<string>;
  /**
   * Gets the locally available dependencies for the specified
   * module. If this function is missing or returns false or undefined
   * the globally available dependencies will be used.
   * @returns The dependencies that should be used for evaluating the
   * module.
   */
  getDependencies?(): AvailableDependencies | undefined | false;
  /**
   * Gets the map of globally available dependencies with their names
   * as keys and their evaluated module content as value.
   * @returns The optionally global dependencies.
   */
  dependencies?: AvailableDependencies;
}

export type ComponentDefinition<T> = ComponentType<T> | RenderCallback<T>;
