import { evalDependency, compileDependency } from './dependency';
import {
  ArbiterModuleMetadata,
  ArbiterModule,
  DependencyFetcher,
  AvailableDependencies,
  DependencyGetter,
} from '../types';

function createEmptyModule(meta: ArbiterModuleMetadata) {
  return {
    ...meta,
    setup() {},
  };
}

function loadDependencies(
  meta: ArbiterModuleMetadata,
  fetchDependency: DependencyFetcher,
  getDependencies: DependencyGetter,
): Promise<AvailableDependencies> {
  const dependencies = {
    ...(getDependencies() || {}),
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
  meta: ArbiterModuleMetadata,
  content: string,
  fetchDependency: DependencyFetcher,
  getDependencies: DependencyGetter,
): Promise<ArbiterModule<TApi>> {
  return loadDependencies(meta, fetchDependency, getDependencies).then(
    dependencies => {
      const app = compileDependency<TApi>(meta.name, content, dependencies);
      return {
        ...app,
        ...meta,
      };
    },
    error => {
      console.error(`Could not load the dependencies of ${meta.name}.`, error);
      return createEmptyModule(meta);
    },
  );
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
  meta: ArbiterModuleMetadata,
  fetchDependency: DependencyFetcher,
  getDependencies: DependencyGetter,
): Promise<ArbiterModule<TApi>> {
  const { link, content } = meta;

  if (link) {
    return fetchDependency(link).then(content =>
      loadFromContent<TApi>(meta, content, fetchDependency, getDependencies),
    );
  } else if (content) {
    return loadFromContent<TApi>(meta, content, fetchDependency, getDependencies);
  } else {
    console.warn('Empty module found!', meta.name);
  }

  return Promise.resolve(createEmptyModule(meta));
}
