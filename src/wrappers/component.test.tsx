import * as React from 'react';
import { wrapComponent } from './component';
import { ArbiterStasis } from '../components';
import { mount } from 'enzyme';

describe('Wrapping Components', () => {
  it('wraps foreign callback', () => {
    const Component = wrapComponent(node => {
      // do nothing
    });
    const element = mount(<Component />);
    expect(element.find(ArbiterStasis)).toHaveLength(1);
  });

  it('wraps wrong input', () => {
    const Component = wrapComponent(undefined);
    const element = mount(<Component />);
    expect(element.find(ArbiterStasis)).toHaveLength(1);
  });

  it('wraps real component', () => {
    class MyComponent extends React.Component {
      render() {
        return <div />;
      }
    }
    const Component = wrapComponent(MyComponent);
    const element = mount(<Component />);
    expect(element.find(ArbiterStasis)).toHaveLength(1);
    expect(element.find(MyComponent)).toHaveLength(1);
  });
});
