import React, { useState } from 'react'
import {
  Text,
  Keyboard,
  View,
  Alert,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import { Avatar, Button, CheckBox, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-navigation'

import CameraModal from '../../lib/InstagramCameraModal'

import { updateDog } from '../Interactors/Dog'

export default ({ navigation }) => {
  const { dog: staleDog, currentUser = false } = navigation.state.params

  const [name, setName] = useState(staleDog.name)
  const [breed, setBreed] = useState(staleDog.breed)
  const [age, setAge] = useState(staleDog.age)
  const [neuteredSpayed, setNeuteredSpayed] = useState(staleDog.neuteredSpayed)
  const [bio, setBio] = useState(staleDog.bio)
  const [photo, setPhoto] = useState(staleDog.imageUri)

  const [loading, setLoading] = useState(false)
  const [modalVisible, showPhotoModal] = useState()

  const onPressUpdateDetails = async () => {
    Keyboard.dismiss()

    if (name === '') {
      Alert.alert('Please enter a name for your dog')
      setLoading(false)
    } else if (breed === '') {
      Alert.alert('Please enter a breed for your dog')
      setLoading(false)
    } else if (age === -1) {
      Alert.alert('Please enter an age for your dog')
      setLoading(false)
    } else if (bio === '') {
      Alert.alert('Please enter a bio for your dog')
      setLoading(false)
    } else {
      setLoading(true)

      const newDog = {
        ...staleDog,
        name,
        lowercaseName: name.toLocaleLowerCase(),
        breed,
        age,
        neuteredSpayed,
        bio,
        imageUri: photo
      }

      await updateDog(staleDog, newDog)
      navigation.goBack()
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
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

        <Avatar
          size="xlarge"
          rounded
          showEditButton={currentUser}
          source={{ uri: photo }}
          icon={{ name: 'pets', type: 'material' }}
          onPress={() => currentUser && showPhotoModal(true)}
          activeOpacity={0.7}
          containerStyle={{ alignSelf: 'center' }}
        />

        {currentUser ? (
          <View style={{ flex: 1 }}>
            <Input
              containerStyle={{ marginTop: 16 }}
              onChangeText={setName}
              value={name}
              label={'Boo'}
              placeholder="Enter dog's name"
            />

            <Input
              containerStyle={{ marginTop: 16 }}
              onChangeText={setBreed}
              value={breed}
              label={'Breed'}
              placeholder="Enter dog's breed"
            />

            <Input
              containerStyle={{ marginTop: 16 }}
              onChangeText={setAge}
              value={age}
              label={'Age'}
              placeholder="Enter dog's age"
            />

            <CheckBox
              title="Neutered / Spayed?"
              checked={neuteredSpayed}
              onPress={() => setNeuteredSpayed(!neuteredSpayed)}
            />

            <Input
              containerStyle={{ marginTop: 16 }}
              onChangeText={setBio}
              value={bio}
              label={'Bio'}
              placeholder="Enter dog's bio"
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
                title="Update Dog"
                onPress={onPressUpdateDetails}
              />
            </View>
          </View>
        ) : (
          <View>
            <Details title={'Name'} info={name} />
            <Details title={'Breed'} info={breed} />
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const Details = ({ title, info, onPress, clickable }) => {
  if (!!!info) return null
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onPress && onPress()
      }}
    >
      <View>
        <Text style={styles.label}>{title}</Text>
        <Text style={[styles.info, clickable && styles.clickable]}>{info}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 6
  },
  clickable: {
    color: 'blue',
    textDecorationLine: 'underline'
  },
  info: { fontSize: 18, marginBottom: 8 },
  container: {
    padding: 12,
    flex: 1,
    justifyContent: 'center'
  },
  input: {
    fontSize: 28,
    marginTop: 6
  },
  button: { marginTop: 24 }
})
