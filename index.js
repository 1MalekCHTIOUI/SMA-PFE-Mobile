/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { typography } from './src/utils/Typography'

typography()
AppRegistry.registerComponent(appName, () => App);
