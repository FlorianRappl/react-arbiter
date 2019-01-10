import * as React from 'react';
import { ArbiterStasis } from './ArbiterStasis';
import { RenderCallback, ComponentDefinition } from '../types';

class ForeignComponentContainer<T> extends React.Component<Partial<T>> {
  private container: HTMLElement | null;
  static contextTypes = {
    // tslint:disable-next-line
    router: null,
  };

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
}

function wrapReactComponent<T>(Component: React.ComponentType<T>): React.ComponentType<T> {
  return (props: T) => (
    <ArbiterStasis>
      <Component {...props} />
    </ArbiterStasis>
  );
}

function wrapForeignComponent<T>(render: RenderCallback<T>): React.ComponentType<T> {
  return (props: T) => (
    <ArbiterStasis>
      <ForeignComponentContainer {...props} render={render} />
    </ArbiterStasis>
  );
}

export function wrapComponent<T>(value: ComponentDefinition<T>) {
  if (value) {
    const argAsReact = value as React.ComponentType<T>;
    const argAsRender = value as RenderCallback<T>;
    const argRender = argAsReact.prototype && argAsReact.prototype.render;

    if (typeof argRender === 'function' || argAsReact.displayName) {
      return wrapReactComponent(argAsReact);
    }

    return wrapForeignComponent(argAsRender);
  } else {
    console.error('The given value is not a valid component.');
    return wrapForeignComponent<T>(() => {});
  }
}

export function wrapElement(content: React.ReactNode | HTMLElement): React.ReactChild {
  if (content instanceof HTMLElement) {
    return (
      <ArbiterStasis>
        <div ref={host => host && host.appendChild(content)} />
      </ArbiterStasis>
    );
  }

  return <ArbiterStasis>{content}</ArbiterStasis>;
}
