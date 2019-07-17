Mind Blown [![Build Status][travis-badge]](https://travis-ci.org/Shufflow/mind-blown) [![codecov][codecov-badge]](https://codecov.io/gh/Shufflow/mind-blown)
===

<a href="http://bit.ly/MindBlown-PlayStore" target="_blank">
  <img
    alt="Google Play"
    src="https://user-images.githubusercontent.com/1066295/61412424-343acf00-a8bf-11e9-88a1-3f4fe559cf73.png"
    width="200px"
  />
</a>
<a href="http://bit.ly/MindBlown-AppStore" target="_blank">
  <img
    alt="Apple App Store"
    src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-preferred_2x.png"
    width="180px"
  />
</a>

## Requirements

The recommended IDE for this project is VS Code with the following extensions

- [React Native Tools](https://github.com/Microsoft/vscode-react-native)
- [TSLint](https://github.com/Microsoft/vscode-tslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [Jest](https://github.com/jest-community/vscode-jest)

Native iOS dependencies are installed with [CocoaPods](https://guides.cocoapods.org/using/getting-started.html), which should be installed with [Bundler](https://bundler.io/).

## Installation

Installing the project and its dependencies

```
yarn && yarn install-ios
```

This should install React, React-Native, Typescript and any other Javascript dependencies, along with installing (if necessary) CococaPods and iOS dependencies.

## Running

Building the app can be done in the following ways:

##### VS Code

There are embedded build tasks for both, iOS and Android.

##### CLI

By running in the Terminal:

```
ENVFILE=[path_to_env] react-native run-{ios|android}
```

##### Xcode

Open `MindBlown.xcworkspace` from the `ios/` directory and select the `MindBlown` scheme before triggering  the build.

#### Testing

You should run tests by calling `yarn test`, but if you want to debug unit tests or run the tests for a single file, there are embedded build tasks for launching Jest with VS Code. These will run in a separate terminal and attach to VS Code's debugger.

## Scripts

The following scripts are embedded with the package:

| Name             | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `install-ios`    | Installs iOS dependencies                                     |
| `lint`           | Runs TSLint                                                   |
| `test`           | Runs tests in the application                                 |
| `update-icons`   | Reads SVG files in assets/icons and stores in assets/icons.ts |
| `gen-licenses`   | Compiles the dependencies' licenses into a single file        |
| `update-version` | Updates app with the given version                            |

#### Bash Scripts

The following bash scripts are available in the `scripts/` directory:

| Name                | Description                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `reset-metro`       | Starts the react-native package with a clean cache                                         |
| `reset-metro--hard` | Clears watchman, deletes the `node_modules` dir and starts the packager with a clean cache |

## License

See the LICENSE file for more info.

[travis-badge]: https://travis-ci.org/Shufflow/mind-blown.svg?branch=develop
[codecov-badge]: https://codecov.io/gh/Shufflow/mind-blown/branch/develop/graph/badge.svg
