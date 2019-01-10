import * as Adapter from 'enzyme-adapter-react-16';
import { shallow, render, mount, configure } from 'enzyme';

// React 16 Enzyme adapter
configure({
  adapter: new Adapter(),
});

declare const global: any;

global.define = () => {};
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.requestAnimationFrame = (cb: any) => setTimeout(cb, 0);
