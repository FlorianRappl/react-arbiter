import * as React from 'react';
import { ArbiterStasis } from '../components';
import { RenderCallback, ComponentDefinition } from '../types';

function createForeignComponentContainer<T>(contextTypes = ['router']) {
  return class ForeignComponentContainer extends React.Component<Partial<T>> {
    private container: HTMLElement | null;
    static contextTypes = contextTypes.reduce((ct, key) => {
      // tslint:disable-next-line
      ct[key] = null;
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

function wrapReactComponent<T>(Component: React.ComponentType<T>): React.ComponentType<T> {
  return (props: T) => (
    <ArbiterStasis>
      <Component {...props} />
    </ArbiterStasis>
  );
}

function wrapForeignComponent<T>(render: RenderCallback<T>, contextTypes?: Array<string>): React.ComponentType<T> {
  const Component = createForeignComponentContainer<T>(contextTypes);

  return (props: T) => (
    <ArbiterStasis>
      <Component {...props} render={render} />
    </ArbiterStasis>
  );
}

export function wrapComponent<T>(value: ComponentDefinition<T>, contextTypes?: Array<string>) {
  if (value) {
    const argAsReact = value as React.ComponentType<T>;
    const argAsRender = value as RenderCallback<T>;
    const argRender = argAsReact.prototype && argAsReact.prototype.render;

    if (typeof argRender === 'function' || argAsReact.displayName) {
      return wrapReactComponent(argAsReact);
    }

    return wrapForeignComponent(argAsRender, contextTypes);
  } else {
    console.error('The given value is not a valid component.');
    return wrapForeignComponent<T>(() => {});
  }
}
