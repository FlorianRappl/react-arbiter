import { ModuleApp, AvailableDependencies, ModuleExports } from '../types';

function requireModule(name: string, dependencies: AvailableDependencies) {
  const dependency = dependencies[name];

  if (!dependency) {
    console.error('Cannot find the required module!', name, dependencies);
  }

  return dependency;
}

export function evalDependency<TApi>(name: string, content: string, dependencies: AvailableDependencies = {}) {
  const mod = {
    exports: {},
  } as ModuleExports<TApi>;
  const require = (moduleName: string) => requireModule(moduleName, dependencies);

  try {
    const importer = new Function('module', 'exports', 'require', content);
    importer(mod, mod.exports, require);
  } catch (e) {
    console.error(`Error while evaluating ${name}.`, e);
  }

  return mod.exports;
}

export function compileDependency<TApi>(
  name: string,
  content: string,
  dependencies: AvailableDependencies,
): ModuleApp<TApi> {
  const app = evalDependency<TApi>(name, content, dependencies);

  if (!app) {
    console.error('Invalid module found.', name);
  } else if (typeof app.setup !== 'function') {
    console.warn('Setup function is missing.', name);
  } else {
    return app;
  }

  return {
    setup() {},
  };
}
