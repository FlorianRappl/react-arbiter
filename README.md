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

### Recalling Modules

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

### Component Stasis

React Arbiter comes with a stasis field for third-party components. This is essentially just an error boundary that helps to prevent any external components destroying the whole application when crashing.

```jsx
const ProtectedComponent = (
  <ArbiterStasis onError={e => console.error(e)}>
    <MyCrashingComponent />
  </ArbiterStasis>
);
```

Furthermore, we can determine what to render when an error occurs:

```jsx
const ProtectedComponent = (
  <ArbiterStasis renderError={e => <div>Display the error: {e.message}</div>}>
    <MyCrashingComponent />
  </ArbiterStasis>
);
```

There is also a HOC to combine the `renderError` with the component to put into a stasis field.

```jsx
const MyStasis = withStasis(({ error, type }) => (
  <div>
    <h1>{type}</h1>
    <p>Display the error: {error.message}</p>
  </div>
));
const ProtectedComponent = (
  <MyStasis type="Example">
    <MyCrashingComponent />
  </MyStasis>
);
```

Besides the added `error` prop other props are being forwarded as expected (see, e.g., the `type` prop in the previous example).

### Wrapping Components

React Arbiter also gives you some utilities for wrapping components. For ordinary React components that means just placing them in a stasis field, however, for non-React components (referred to *foreign* components) we also introduce a React wrapper that hosts a DOM node for carrying the foreign component.

```jsx
const MyReactComponent = props => <div>{props.children}</div>;
MyReactComponent.displayName = 'MyReactComponent';

const MyForeignComponent = (element, props) => {
  element.innerHTML = '<b>Hello World!</b>';
};

const WrappedReactComponent = wrapComponent(MyReactComponent);
const WrappedForeignComponent = wrapComponent(MyForeignComponent);
```

Important: The `wrapComponent` only supports React SFCs if they have the `displayName` property properly set (see above). Otherwise, this helper function cannot distinguish between a foreign and a React component and will therefore choose the foreign component.

## License

react-arbiter is released using the MIT license. For more information see the [LICENSE file](LICENSE).
