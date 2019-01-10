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

export type ComponentDefinition<T> = ComponentType<T> | RenderCallback<T>;
