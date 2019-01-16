import { AppRegistry } from 'react-native';
import App from 'src/App';
import 'babel-polyfill';
import { name as appName } from './src/app.json';

AppRegistry.registerComponent(appName, () => App);
