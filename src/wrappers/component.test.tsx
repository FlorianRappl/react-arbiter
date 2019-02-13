import * as React from 'react';
import { wrapComponent } from './component';
import { ArbiterStasis } from '../components';
import { mount } from 'enzyme';

describe('Wrapping Components', () => {
  it('wraps foreign callback', () => {
    console.error = jest.fn();
    const Component = wrapComponent(node => {
      // do nothing
    });
    const element = mount(<Component />);
    expect(element.find(ArbiterStasis)).toHaveLength(1);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('wraps wrong input', () => {
    console.error = jest.fn();
    const Component = wrapComponent(undefined);
    const element = mount(<Component />);
    expect(element.find(ArbiterStasis)).toHaveLength(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('wraps real component', () => {
    console.error = jest.fn();
    class MyComponent extends React.Component {
      render() {
        return <div />;
      }
    }
    const Component = wrapComponent(MyComponent);
    const element = mount(<Component />);
    expect(element.find(ArbiterStasis)).toHaveLength(1);
    expect(element.find(MyComponent)).toHaveLength(1);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
