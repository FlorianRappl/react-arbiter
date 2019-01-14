import * as React from 'react';
import { withRecall, RecallProps } from '../src';

interface Api {
  id: string;
}

const DisplayModules: React.SFC<RecallProps<Api>> = ({ loaded, modules, children }) =>
  loaded ? (
    <div>
      <b>Showing modules</b>
      <ul>
        {modules.map(m => (
          <li key={m.hash}>{m.name}</li>
        ))}
      </ul>
      {children}
    </div>
  ) : (
    <div>Loading modules ...</div>
  );

const Arbiter = withRecall(DisplayModules, {
  createApi(meta) {
    return { id: meta.name };
  },
  getModules() {
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve([
            {
              version: '1.0.0',
              name: 'A',
              dependencies: {},
              content: 'module.exports = { setup: function(api) { console.log(api, "Module A"); } }',
              hash: '1',
            },
            {
              version: '1.0.0',
              name: 'B',
              dependencies: {},
              content: 'module.exports = { setup: function(api) { console.log(api, "Module B"); } }',
              hash: '2',
            },
            {
              version: '1.0.0',
              name: 'C',
              dependencies: {},
              content: 'module.exports = { setup: function(api) { console.log(api, "Module C"); } }',
              hash: '3',
            },
          ]),
        2000,
      ),
    );
  },
});

export default () => (
  <Arbiter>
    <b>End of example</b>
  </Arbiter>
);
