import { loadModule } from './load';
import { defaultFetchDependency } from './fetch';
import { setupModule } from './setup';
import { isfunc } from './isfunc';
import {
  AvailableDependencies,
  ArbiterModule,
  DependencyGetter,
  ApiCreator,
  ArbiterModuleFetcher,
  ArbiterModuleCache,
} from '../types';

const defaultGlobalDependencies: AvailableDependencies = {};
const defaultGetDependencies: DependencyGetter = () => false;
const defaultCache: ArbiterModuleCache = {
  retrieve() {
    return Promise.resolve([]);
  },
  update(_, received) {
    return Promise.resolve(received);
  },
};

function checkCreateApi<TApi>(createApi: ApiCreator<TApi>) {
  if (!isfunc(createApi)) {
    console.warn('Invalid `createApi` function. Skipping module installation.');
    return false;
  }

  return true;
}

function checkFetchModules(fetchModules: ArbiterModuleFetcher) {
  if (!isfunc(fetchModules)) {
    console.error('Could not get the modules. Provide a valid `getModules` function as prop.');
    return false;
  }

  return true;
}

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
  cache = defaultCache,
): Promise<Array<ArbiterModule<TApi>>> {
  if (checkFetchModules(fetchModules)) {
    const getDependencies: DependencyGetter = target => {
      return getLocalDependencies(target) || globalDependencies;
    };

    return Promise.resolve(cache.retrieve()).then(cachedModules =>
      Promise.resolve(fetchModules(cachedModules || []))
        .then(receivedModules => cache.update(cachedModules, receivedModules))
        .then(moduleData => Promise.all(moduleData.map(m => loadModule<TApi>(m, fetchDependency, getDependencies)))),
    );
  }

  return Promise.resolve([]);
}

/**
 * Sets up the evaluated modules to become integrated modules.
 * @param createApi The function to create an API object for a module.
 * @param modules The available evaluated app modules.
 * @returns The integrated modules.
 */
export function createModules<TApi>(createApi: ApiCreator<TApi>, modules: Array<ArbiterModule<TApi>>) {
  if (checkCreateApi(createApi)) {
    for (const app of modules) {
      const api = createApi(app);
      setupModule(app, api);
    }
  }

  return modules;
}

/**
 * Sets up an evaluated module to become an integrated module.
 * @param createApi The function to create an API object for the module.
 * @param app The available evaluated app module.
 * @returns The integrated module.
 */
export function createModule<TApi>(createApi: ApiCreator<TApi>, app: ArbiterModule<TApi>) {
  if (checkCreateApi(createApi)) {
    const api = createApi(app);
    setupModule(app, api);
  }

  return app;
}
