import { loadModule } from './load';
import { defaultFetchDependency } from './fetch';
import { setupModule } from './setup';
import { AvailableDependencies, ArbiterModule, DependencyGetter, ApiCreator, ArbiterModuleFetcher } from '../types';

const defaultGlobalDependencies: AvailableDependencies = {};
const defaultGetDependencies: DependencyGetter = () => false;

/**
 * Loads the modules by first getting them, then evaluating the raw content.
 * @param fetchModules The function to resolve the modules.
 * @param fetchDependency A function to fetch the dependencies. By default, `fetch` is used.
 * @param dependencies The availablly global dependencies, if any.
 * @returns A promise leading to the evaluated modules.
 */
export function loadModules<TApi>(
  fetchModules: ArbiterModuleFetcher,
  fetchDependency = defaultFetchDependency,
  globalDependencies = defaultGlobalDependencies,
  getLocalDependencies = defaultGetDependencies,
) {
  if (typeof fetchModules === 'function') {
    const getDependencies: DependencyGetter = target => {
      return getLocalDependencies(target) || globalDependencies;
    };
    return Promise.resolve(fetchModules()).then(moduleData =>
      Promise.all(moduleData.map(m => loadModule<TApi>(m, fetchDependency, getDependencies))),
    );
  } else {
    console.error('Could not get the modules. Provide a valid `getModules` function as prop.');
    return Promise.resolve([]);
  }
}

/**
 * Sets up the evaluated modules to become integrated modules.
 * @param createApi The function to create an API object for a module.
 * @param modules The available evaluated modules.
 * @returns The integrated modules.
 */
export function setupModules<TApi>(createApi: ApiCreator<TApi>, modules: Array<ArbiterModule<TApi>>) {
  if (typeof createApi === 'function') {
    for (const app of modules) {
      const api = createApi(app);
      setupModule(app, api);
    }
  } else {
    console.warn('Invalid `createApi` function. Skipping module installation.');
  }

  return modules;
}
