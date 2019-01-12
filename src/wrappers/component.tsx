import * as React from 'react';
import { ArbiterStasis } from '../components';
import { RenderCallback, ComponentDefinition } from '../types';

function createForeignComponentContainer<T>(contextTypes = ['router']) {
  return class ForeignComponentContainer extends React.Component<Partial<T>> {
    private container: HTMLElement | null;
    static contextTypes = contextTypes.reduce((ct, key) => {
      // tslint:disable-next-line
      ct[key] = () => {};
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

function wrapReactComponent<T, K extends keyof T>(
  Component: React.ComponentType<T>,
  options?: Pick<T, K>,
): React.ComponentType<Exclude<T, K>> {
  return (props: Exclude<T, K>) => (
    <ArbiterStasis>
      <Component {...props} {...options} />
    </ArbiterStasis>
  );
}

function wrapForeignComponent<T, K extends keyof T>(
  render: RenderCallback<T>,
  options?: Pick<T, K>,
  contextTypes?: Array<string>,
): React.ComponentType<Exclude<T, K>> {
  const Component = createForeignComponentContainer<T>(contextTypes);

  return (props: Exclude<T, K>) => (
    <ArbiterStasis>
      <Component {...props} {...options} render={render} />
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
export function wrapComponent<T, K extends keyof T>(
  value: ComponentDefinition<T>,
  options?: Pick<T, K>,
  contextTypes?: Array<string>,
) {
  if (value) {
    const argAsReact = value as React.ComponentType<T>;
    const argAsRender = value as RenderCallback<T>;
    const argRender = argAsReact.prototype && argAsReact.prototype.render;

    if (typeof argRender === 'function' || argAsReact.displayName) {
      return wrapReactComponent(argAsReact, options);
    }

    return wrapForeignComponent(argAsRender, options, contextTypes);
  } else {
    console.error('The given value is not a valid component.');
    return wrapForeignComponent<T, K>(() => {});
  }
}
