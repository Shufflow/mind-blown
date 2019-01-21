Mind Blown
===

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
react-native run-{ios|android}
```

##### Xcode

Open `MindBlown.xcworkspace` from the `ios/` directory and select the `MindBlown` scheme before triggering  the build.

#### Testing

You should run tests by calling `yarn test`, but if you want to debug unit tests or run the tests for a single file, there are embedded build tasks for launching Jest with VS Code. These will run in a separate terminal and attach to VS Code's debugger.

## Scripts

The following scripts are embedded with the package:

| Name           | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `install-ios`  | Installs iOS dependencies                                     |
| `lint`         | Runs TSLint                                                   |
| `test`         | Runs tests in the application                                 |
| `update-icons` | Reads SVG files in assets/icons and stores in assets/icons.ts |
| `gen-licenses` | Compiles the dependencies' licenses into a single file        |

## License

ReCaptcha is available under the MIT license. See the LICENSE file for more info.
