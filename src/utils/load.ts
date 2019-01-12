import { evalDependency, compileDependency } from './dependency';
import { ModuleMetadata, Module, DependencyFetcher, AvailableDependencies } from '../types';

function loadDependencies(
  meta: ModuleMetadata,
  fetchDependency: DependencyFetcher,
  globalDependencies: AvailableDependencies,
): Promise<AvailableDependencies> {
  const dependencies = {
    ...globalDependencies,
  };
  const existingDependencies = Object.keys(dependencies);
  const dependencyMap = Object.keys(meta.dependencies || {})
    .filter(name => existingDependencies.indexOf(name) === -1)
    .map(name => ({
      name,
      url: meta.dependencies[name],
      content: '',
    }));

  return Promise.all(dependencyMap.map(m => fetchDependency(m.url).then(c => (m.content = c)))).then(() => {
    for (const item of dependencyMap) {
      dependencies[item.name] = evalDependency(item.name, item.content, dependencies);
    }

    return dependencies;
  });
}

function loadFromContent<TApi>(
  meta: ModuleMetadata,
  content: string,
  fetchDependency: DependencyFetcher,
  dependencies: AvailableDependencies,
): Promise<Module<TApi>> {
  return loadDependencies(meta, fetchDependency, dependencies).then(dependencies => {
    const app = compileDependency<TApi>(meta.name, content, dependencies);
    return {
      ...app,
      ...meta,
    };
  });
}

/**
 * Loads the given raw module content by resolving its dependencies and
 * evaluating the content.
 * @param meta The raw module content as received from the server.
 * @param fetchDependency The function to resolve a dependency.
 * @param dependencies The already evaluated global dependencies.
 * @returns A promise leading to the module content which has the metadata and a `setup` function.
 */
export function loadModule<TApi>(
  meta: ModuleMetadata,
  fetchDependency: DependencyFetcher,
  dependencies: AvailableDependencies,
): Promise<Module<TApi>> {
  const { link, content } = meta;

  if (link) {
    return fetchDependency(link).then(content => loadFromContent<TApi>(meta, content, fetchDependency, dependencies));
  } else if (content) {
    return loadFromContent<TApi>(meta, content, fetchDependency, dependencies);
  } else {
    console.warn('Empty module found!', meta.name);
  }

  return Promise.resolve({
    ...meta,
    setup() {},
  });
}
