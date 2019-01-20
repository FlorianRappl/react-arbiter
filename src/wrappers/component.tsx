import * as React from 'react';
import { ArbiterStasis } from '../components';
import { RenderCallback, ComponentDefinition, StasisOptions } from '../types';

type ComponentOptions<T> = Pick<Partial<T> & StasisOptions, Exclude<keyof T, keyof StasisOptions>>;

function createForeignComponentContainer<T>(contextTypes = ['router']) {
  return class ForeignComponentContainer extends React.Component<Partial<T>> {
    private container: HTMLElement | null;
    static contextTypes = contextTypes.reduce((ct, key) => {
      // tslint:disable-next-line
      ct[key] = () => null;
      return ct;
    }, {});

    componentDidMount() {
      const node = this.container;
      const ctx = this.context;

      if (node) {
        const { render, ...rest } = this.props as any;
        render(node, rest, ctx);
      }
    }

    render() {
      return (
        <div
          ref={node => {
            this.container = node;
          }}
        />
      );
    }
  };
}

function wrapReactComponent<T, K extends keyof ComponentOptions<T>>(
  Component: React.ComponentType<T>,
  stasisOptions: StasisOptions,
  componentOptions: ComponentOptions<T>,
): React.ComponentType<Exclude<T, K>> {
  return (props: Exclude<T, K>) => (
    <ArbiterStasis {...stasisOptions}>
      <Component {...props} {...componentOptions} />
    </ArbiterStasis>
  );
}

function wrapForeignComponent<T, K extends keyof ComponentOptions<T>>(
  render: RenderCallback<T>,
  stasisOptions: StasisOptions,
  componentOptions: ComponentOptions<T>,
  contextTypes?: Array<string>,
): React.ComponentType<Exclude<T, K>> {
  const Component = createForeignComponentContainer<T>(contextTypes);

  return (props: Exclude<T, K>) => (
    <ArbiterStasis {...stasisOptions}>
      <Component {...props} {...componentOptions} render={render} />
    </ArbiterStasis>
  );
}

/**
 * Wraps the provided component (or rendering function) to a React component
 * with automatic stasis usage.
 * @param value The component value to wrap within a stasis.
 * @param options The options to consider.
 * @param contextTypes The available context types for non-React components.
 * @returns A React component wrapping the value.
 */
export function wrapComponent<T>(
  value: ComponentDefinition<T>,
  options: Partial<T> & StasisOptions = {},
  contextTypes?: Array<string>,
) {
  const { onError, renderError, ...componentOptions } = options;
  const stasisOptions: StasisOptions = { onError, renderError };

  if (value) {
    const argAsReact = value as React.ComponentType<T>;
    const argAsRender = value as RenderCallback<T>;
    const argRender = argAsReact.prototype && argAsReact.prototype.render;

    if (typeof argRender === 'function' || argAsReact.displayName) {
      return wrapReactComponent(argAsReact, stasisOptions, componentOptions);
    }

    return wrapForeignComponent(argAsRender, stasisOptions, componentOptions, contextTypes);
  } else {
    console.error('The given value is not a valid component.');
    return wrapForeignComponent(() => {}, stasisOptions, componentOptions, contextTypes);
  }
}
