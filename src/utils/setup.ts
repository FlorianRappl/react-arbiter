import { ArbiterModule } from '../types';

/**
 * Sets up the given module by calling the exported `setup` function
 * on the module.
 * @param app The module's evaluated content.
 * @param api The generated API for the module.
 */
export function setupModule<TApi>(app: ArbiterModule<TApi>, api: TApi) {
  try {
    app.setup(api);
  } catch (e) {
    console.error(`Error while setting up ${app.name}.`, e);
  }
}
