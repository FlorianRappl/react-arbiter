import * as React from 'react';
import { ArbiterStasis } from '../components';

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
