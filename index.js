import { AppRegistry, YellowBox } from 'react-native'
import App from './src/Screens/App'
YellowBox.ignoreWarnings([
  'Warning: componentWillReceive',
  'Warning: componentWillMount'
])
AppRegistry.registerComponent('BreedUp', () => App)
