import { Module } from '../types';

export function setupModule<TApi>(app: Module<TApi>, api: TApi) {
  try {
    app.setup(api);
  } catch (e) {
    console.error(`Error while setting up ${app.name}.`, e);
  }
}
