import {
  loadModules,
  createModules,
  loadModulesMetadata,
  getDependencyResolver,
  loadModule,
  createModule,
} from '../utils';
import { ArbiterRecallOptions, ArbiterRecallModulesLoaded, ArbiterModule, ApiCreator } from '../types';

function evalAll<TApi>(
  createApi: ApiCreator<TApi>,
  oldModules: Array<ArbiterModule<TApi>>,
  newModules: Array<ArbiterModule<TApi>>,
) {
  for (const oldModule of oldModules) {
    const [newModule] = newModules.filter(m => m.name === oldModule.name);

    if (newModule) {
      newModules.splice(newModules.indexOf(newModule), 1);
    }
  }

  return createModules(createApi, [...oldModules, ...newModules]);
}

/**
 * This strategy starts rendering when the modules metadata has been received.
 * Evaluates the modules once available without waiting for all modules to be
 * available.
 */
export function blazingStrategy<TApi>(options: ArbiterRecallOptions<TApi>, cb: ArbiterRecallModulesLoaded<TApi>) {
  const { fetchModules, fetchDependency, dependencies, getDependencies, cache, createApi, modules = [] } = options;
  const getDep = getDependencyResolver(dependencies, getDependencies);
  const loader = loadModulesMetadata(fetchModules, cache);
  const allModules = createModules(createApi, [...modules]);

  if (allModules.length > 0) {
    cb(undefined, allModules);
  }

  loader.then(metadata =>
    metadata.map(m =>
      loadModule<TApi>(m, getDep, fetchDependency).then(mod => {
        const available = modules.filter(m => m.name === mod.name).length === 0;

        if (available) {
          allModules.push(createModule(createApi, mod));
          cb(undefined, allModules);
        }
      }),
    ),
  );

  return loader;
}

/**
 * The async strategy picked when no strategy is declared and async is set to
 * true. Directly renders, but waits for all modules to be available before
 * evaluating them.
 */
export function asyncStrategy<TApi>(options: ArbiterRecallOptions<TApi>, cb: ArbiterRecallModulesLoaded<TApi>) {
  standardStrategy(options, cb);
  return Promise.resolve();
}

/**
 * The standard strategy that is used if no strategy is declared and async is
 * false. Loads and evaluates all modules before rendering.
 */
export function standardStrategy<TApi>(options: ArbiterRecallOptions<TApi>, cb: ArbiterRecallModulesLoaded<TApi>) {
  const { fetchModules, fetchDependency, dependencies, getDependencies, cache, createApi, modules = [] } = options;
  return loadModules(fetchModules, fetchDependency, dependencies, getDependencies, cache).then(
    newModules => cb(undefined, evalAll(createApi, modules, newModules)),
    error => cb(error, []),
  );
}
