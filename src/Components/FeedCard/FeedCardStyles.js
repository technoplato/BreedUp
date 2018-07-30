import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 0
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  imageAndTextContainer: {
    padding: 16,
    flex: 1,
    flexDirection: 'row'
  },
  postMetadata: {
    paddingLeft: 12,
    flexDirection: 'column'
  },
  text: {
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 12
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    backgroundColor: 'transparent'
  },
  buttonText: {
    color: 'black'
  }
})
