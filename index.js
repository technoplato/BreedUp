import { AppRegistry, YellowBox } from 'react-native'
import App from './src/Screens/App'
YellowBox.ignoreWarnings([
  'Warning: componentWillReceive',
  'Warning: componentWillMount',
  'Warning: Cannot update during an existing'
])
AppRegistry.registerComponent('BreedUp', () => App)
