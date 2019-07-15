# React Arbiter Changelog

## 0.7.1

- Drop new modules if they would override existing modules
- Updated dependencies
- Fixed vulnerabilities in third-party dependencies

## 0.7.0

- Improved HOC signatures to support currying (`createRecall`, `createStasis`)
- Introduced new `async` parameter

## 0.6.0

- Changed `setupModules` to `createModules`
- Updated dependencies

## 0.5.0

- Throw `MODULE_NOT_FOUND` error if module cannot be found
- Support for `sourceURL` added
- Added `isfunc` utility

## 0.4.1

- Improved typings
- Added new `wrapper` option for `wrapElement`

## 0.4.0

- Improved documentation
- Renamed types to avoid clashes
- Renamed `getModules` to `fetchModules`
- Added `getDependencies` prop
- Added `openCache` utility

## 0.3.0

- Added examples to README
- Improved API of `wrapComponent`

## 0.2.0

- Added documentation comments
- Additional options for `wrapComponent` and `wrapElement`
- Introduced `setupModules` and `loadModules` helper

## 0.1.0

- Initial Release
