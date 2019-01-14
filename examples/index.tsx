import * as React from 'react';
import { render } from 'react-dom';
import StasisExample from './stasis';
import RecallExample from './recall';

const examples = [
  StasisExample,
  RecallExample,
];

const App: React.SFC = () => (
  <div>
    <h1>Available examples</h1>
    <ul>
      <li>Stasis</li>
      <li>Recall</li>
    </ul>
    <div></div>
  </div>
);

render(<App />, document.querySelector('#app'));
