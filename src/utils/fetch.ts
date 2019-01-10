export function defaultFetchDependency(url: string) {
  return fetch(url, {
    method: 'GET',
    cache: 'force-cache',
  }).then(m => m.text());
}
