import { StyleSheet } from 'react-native'

import { Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1
  },

  profileHeaderContainer: {
    width: '100%',
    flexDirection: 'row'
  },

  avatarContainer: {
    width: 120,
    height: 120
  },

  usernameAndButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    backgroundColor: Colors.dogBoneBlue,
    height: 45,
    marginTop: 12,
    borderRadius: 5
  }
})
