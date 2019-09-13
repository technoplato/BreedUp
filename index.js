import { AppRegistry, YellowBox } from 'react-native'
import App from './src/Screens/App'
YellowBox.ignoreWarnings(['Warning: componentWillReceive'])
AppRegistry.registerComponent('BreedUp', () => App)
