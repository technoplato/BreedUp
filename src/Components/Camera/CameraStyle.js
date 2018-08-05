import { StyleSheet } from 'react-native'
import { Metrics, Colors } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    backgroundColor: Colors.orange
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    padding: Metrics.doubleBaseMargin,
    width: Metrics.screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0
  },
  button: {
    padding: Metrics.baseMargin
  }
})
