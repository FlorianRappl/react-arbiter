import { ComponentType } from 'react';

export interface ArbiterModuleMetadata {
  /**
   * The name of the module, i.e., the package id.
   */
  name: string;
  /**
   * The version of the module. Should be semantically versioned.
   */
  version: string;
  /**
   * The dependency map of the module.
   */
  dependencies: {
    /**
     * The name of the dependency and the related location, which
     * defines where to get (i.e., fetch) it from.
     */
    [name: string]: string;
  };
  /**
   * The content of the module. If the content is not available
   * the link will be used (unless caching has been activated).
   */
  content?: string;
  /**
   * The link for retrieving the content of the module.
   */
  link?: string;
  /**
   * The computed hash value of the module's content. Should be
   * accurate to allow caching.
   */
  hash: string;
  /**
   * If available indicates that the module should not be cached.
   * In case of a string this is interpreted as the expiration time
   * of the cache. In case of an accurate hash this should not be
   * required or set.
   */
  noCache?: boolean | string;
}

export interface ArbiterModuleApp<TApi> {
  /**
   * Integrates the evaluated module into the application.
   * @param api The API to access the application.
   */
  setup(api: TApi): void;
}

export interface ArbiterModuleExports<TApi> {
  exports: ArbiterModuleApp<TApi> | undefined;
}

export type ArbiterModule<TApi> = ArbiterModuleApp<TApi> & ArbiterModuleMetadata;

export interface DependencyFetcher {
  /**
   * Defines how other dependencies are fetched.
   * @param url The URL to the dependency that should be fetched.
   * @returns The promise yielding the dependency's content.
   */
  (url: string): Promise<string>;
}

export interface ApiCreator<TApi> {
  /**
   * Creates an API for the given raw module.
   * @param target The raw (meta) content of the module.
   * @returns The API object to be used with the module.
   */
  (target: ArbiterModuleMetadata): TApi;
}

export interface DependencyGetter {
  /**
   * Gets the locally available dependencies for the specified
   * module. If this function is missing or returns false or undefined
   * the globally available dependencies will be used.
   * @returns The dependencies that should be used for evaluating the
   * module.
   */
  (target: ArbiterModuleMetadata): AvailableDependencies | undefined | false;
}

export interface ArbiterModuleFetcher {
  /**
   * Gets the raw modules from (e.g., a server) asynchronously.
   * @returns The promise yielding an array of raw modules.
   */
  (): Promise<Array<ArbiterModuleMetadata>>;
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
   * The callback function for creating an API object.
   * The API object is passed on to a specific module.
   */
  createApi: ApiCreator<TApi>;
  /**
   * The callback for fetching the dynamic modules.
   */
  fetchModules: ArbiterModuleFetcher;
  /**
   * Optionally, some already existing evaluated modules, e.g.,
   * helpful when debugging.
   */
  modules?: Array<ArbiterModule<TApi>>;
  /**
   * The callback for defining how a dependency will be fetched.
   */
  fetchDependency?: DependencyFetcher;
  /**
   * Gets a map of available locale dependencies for a module.
   * The dependencies are used during the evaluation.
   */
  getDependencies?: DependencyGetter;
  /**
   * Gets the map of globally available dependencies with their names
   * as keys and their evaluated module content as value.
   */
  dependencies?: AvailableDependencies;
}

export type ComponentDefinition<T> = ComponentType<T> | RenderCallback<T>;
