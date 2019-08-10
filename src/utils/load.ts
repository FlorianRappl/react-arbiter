import { compileDependency } from './dependency';
import { defaultFetchDependency } from './fetch';
import { ArbiterModuleMetadata, ArbiterModule, DependencyGetter } from '../types';

function createEmptyModule(meta: ArbiterModuleMetadata) {
  return {
    ...meta,
    setup() {},
  };
}

function loadFromContent<TApi>(
  meta: ArbiterModuleMetadata,
  content: string,
  getDependencies: DependencyGetter,
  link?: string,
): ArbiterModule<TApi> {
  const dependencies = {
    ...(getDependencies(meta) || {}),
  };
  const app = compileDependency<TApi>(meta.name, content, link, dependencies);
  return {
    ...app,
    ...meta,
  };
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
  getDependencies: DependencyGetter,
  fetchDependency = defaultFetchDependency,
): Promise<ArbiterModule<TApi>> {
  const { link, content } = meta;
  const retrieve = link ? fetchDependency(link) : content ? Promise.resolve(content) : undefined;

  if (retrieve) {
    return retrieve.then(content => loadFromContent<TApi>(meta, content, getDependencies, link));
  } else {
    console.warn('Empty module found!', meta.name);
  }

  return Promise.resolve(createEmptyModule(meta));
}
