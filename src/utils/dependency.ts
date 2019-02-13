import { ArbiterModuleApp, AvailableDependencies, ArbiterModuleExports } from '../types';

function requireModule(name: string, dependencies: AvailableDependencies) {
  const dependency = dependencies[name];

  if (!dependency) {
    console.error('Cannot find the required module!', name, dependencies);
  }

  return dependency;
}

/**
 * Compiles the given content from a generic dependency.
 * @param name The name of the dependency to compile.
 * @param content The content of the dependency to compile.
 * @param dependencies The globally available dependencies.
 * @returns The evaluated dependency.
 */
export function evalDependency<TApi>(name: string, content: string, dependencies: AvailableDependencies = {}) {
  const mod = {
    exports: {},
  } as ArbiterModuleExports<TApi>;
  const require = (moduleName: string) => requireModule(moduleName, dependencies);

  try {
    const importer = new Function('module', 'exports', 'require', content);
    importer(mod, mod.exports, require);
  } catch (e) {
    console.error(`Error while evaluating ${name}.`, e);
  }

  return mod.exports;
}

/**
 * Compiles the given content from a module with a dependency resolution.
 * @param name The name of the dependency to compile.
 * @param content The content of the dependency to compile.
 * @param dependencies The globally available dependencies.
 * @returns The evaluated module.
 */
export function compileDependency<TApi>(
  name: string,
  content: string,
  dependencies: AvailableDependencies,
): ArbiterModuleApp<TApi> {
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
