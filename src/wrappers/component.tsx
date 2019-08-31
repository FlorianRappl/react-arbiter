import * as React from 'react';
import { ArbiterStasis } from '../components';
import { isfunc } from '../utils';
import { RenderCallback, ComponentDefinition, StasisOptions, WrapComponentOptions } from '../types';

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

function wrapReactComponent<T, U>(
  Component: React.ComponentType<T & U>,
  stasisOptions: StasisOptions,
  componentOptions: U | undefined,
): React.ComponentType<T> {
  return (props: T) => (
    <ArbiterStasis {...stasisOptions} renderProps={props}>
      <Component {...props} {...(componentOptions || ({} as any))} />
    </ArbiterStasis>
  );
}

function wrapForeignComponent<T, U>(
  render: RenderCallback<T & U>,
  stasisOptions: StasisOptions,
  componentOptions: U | undefined,
  contextTypes?: Array<string>,
): React.ComponentType<T> {
  const Component = createForeignComponentContainer<T>(contextTypes);

  return (props: T) => (
    <ArbiterStasis {...stasisOptions} renderProps={props}>
      <Component {...props} {...(componentOptions || ({} as any))} render={render} />
    </ArbiterStasis>
  );
}

/**
 * Wraps the provided component (or rendering function) to a React component
 * with automatic stasis usage.
 * @param value The component value to wrap within a stasis.
 * @param options The options to consider.
 * @returns A React component wrapping the value.
 */
export function wrapComponent<T, U>(value: ComponentDefinition<T & U>, options: WrapComponentOptions<U> = {}) {
  const { forwardProps, contextTypes = [], ...stasisOptions } = options;

  if (value) {
    const argAsReact = value as React.ComponentType<T & U>;
    const argAsRender = value as RenderCallback<T & U>;
    const argRender = argAsReact.prototype && argAsReact.prototype.render;

    if (isfunc(argRender) || argAsReact.displayName) {
      return wrapReactComponent<T, U>(argAsReact, stasisOptions, forwardProps);
    }

    return wrapForeignComponent<T, U>(argAsRender, stasisOptions, forwardProps, contextTypes);
  } else {
    console.error('The given value is not a valid component.');
    return wrapForeignComponent<T, U>(() => {}, stasisOptions, forwardProps, contextTypes);
  }
}
