import React, { useState } from 'react'
import { Text, Keyboard, View, Alert } from 'react-native'
import { Button, Input, Avatar } from 'react-native-elements'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import { SafeAreaView } from 'react-navigation'

import styles from '../Styles/AddDogStyles'
import { addDog } from '../Interactors/Dog'

import CameraModal from '../../lib/InstagramCameraModal'

export default ({ navigation }) => {
  const ownerId = navigation.state.params.userId
  if (!ownerId) {
    throw 'No User ID Provided. How in the world do you expect me to add a dog?'
  }

  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [photo, setPhoto] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalVisible, showPhotoModal] = useState()

  const onPressAddDog = async () => {
    Keyboard.dismiss()

    // Show loading
    setLoading(true)

    if (photo === '') {
      Alert.alert('Please provide a picture for your dog')
      setLoading(false)
    } else if (name === '') {
      Alert.alert('Please enter a name for your dog')
      setLoading(false)
    } else if (breed === '') {
      Alert.alert('Please enter a breed for your dog')
      setLoading(false)
    } else {
      await addDog(ownerId, name, breed, photo)
      navigation.goBack()
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareView
        style={{
          flex: 1,
          padding: 10
        }}
      >
        <CameraModal
          onPictureApproved={setPhoto}
          isModalVisible={modalVisible}
          cancel={() => showPhotoModal(false)}
        />

        {photo ? (
          <Avatar
            size="xlarge"
            rounded
            showEditButton
            source={{ uri: photo }}
            icon={{ name: 'pets', type: 'material' }}
            onPress={() => showPhotoModal(true)}
            activeOpacity={0.7}
            containerStyle={{ alignSelf: 'center' }}
          />
        ) : (
          <Avatar
            size="xlarge"
            rounded
            showEditButton
            icon={{ name: 'pets', type: 'material' }}
            onPress={() => showPhotoModal(true)}
            activeOpacity={0.7}
            containerStyle={{ alignSelf: 'center' }}
          />
        )}

        <Input
          containerStyle={{ marginTop: 16 }}
          onChangeText={setName}
          value={name}
          label={'Name'}
          placeholder="Enter dog's name"
        />

        <Input
          containerStyle={{ marginTop: 16 }}
          onChangeText={setBreed}
          value={breed}
          label={'Breed'}
          placeholder="Enter dog's breed"
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            flexDirection: 'column',
            paddingBottom: 32
          }}
        >
          <Button
            style={styles.button}
            loading={loading}
            disabled={loading}
            height={42}
            title="Add Dog"
            onPress={onPressAddDog}
          />
        </View>
      </KeyboardAwareView>
    </SafeAreaView>
  )
}
