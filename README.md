# ![React Arbiter](docs/logo.png)

[![Build Status](https://dev.azure.com/FlorianRappl/react-arbiter/_apis/build/status/react-arbiter-CI?branchName=master)](https://dev.azure.com/FlorianRappl/react-arbiter/_build/latest?definitionId=4?branchName=master)
[![npm Version](https://img.shields.io/npm/v/react-arbiter.svg)](https://www.npmjs.com/package/react-arbiter)
[![GitHub Tag](https://img.shields.io/github/tag/FlorianRappl/react-arbiter.svg)](https://github.com/FlorianRappl/react-arbiter/releases)
[![GitHub Issues](https://img.shields.io/github/issues/FlorianRappl/react-arbiter.svg)](https://github.com/FlorianRappl/react-arbiter/issues)

React Arbiter provides a sets of components and utilities to recall runtime extensions to your application and to stasis third-party components to avoid crashing your application.

## Getting Started

You need to have [Node](https://nodejs.org/) with NPM installed. In your repository run

```sh
npm i react-arbiter
```

In the simplest case you want to just use the `ArbiterRecall` without any loading special rendering while loading. For this use

```jsx
import { ArbiterRecall } from 'react-arbiter';

function createApi(moduleMeta) {
  //create here an API object for the respective module
  return {};
}

function getModules() {
  //get a list of the available modules, potentially with content
  return fetch('/your/modules');
}

const App = (
  <ArbiterRecall createApi={createApi} getModules={getModules}>
    <YourComponent />
  </ArbiterRecall>
);
```

A module comes with the following interface:

```ts
interface ModuleMetadata {
  version: string;
  name: string;
  dependencies: {
    [name: string]: string;
  };
  content?: string;
  link?: string;
  hash: string;
}
```

This is similar to what the `package.json` looks like, however, containing three new elements: A hash representing the module, and either a link to the module's content (`link`) or the content directly (`content`).

(tbd)

## License

react-arbiter is released using the MIT license. For more information see the [LICENSE file](LICENSE).
