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
