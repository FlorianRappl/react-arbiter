import * as React from 'react';
import { ArbiterStasis, ArbiterStasisProps } from '../components';

/**
 * Wraps the given node in a stasis. If a plain HTML element is provided
 * a React wrapper (host or carrier) is created.
 * @param content The content to be wrapped.
 * @param options The options to consider.
 * @returns A React node wrapping the content.
 */
export function wrapElement(
  content: React.ReactNode | HTMLElement,
  options: ArbiterStasisProps = {},
): React.ReactChild {
  if (content instanceof HTMLElement) {
    return (
      <ArbiterStasis {...options}>
        <div ref={host => host && host.appendChild(content)} />
      </ArbiterStasis>
    );
  }

  return <ArbiterStasis {...options}>{content}</ArbiterStasis>;
}
