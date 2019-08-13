import React from "react"
import {
  AsyncStorage,
  ScrollView,
  Platform,
  Text,
  Alert,
  TouchableOpacity,
  View,
  Image
} from "react-native"
import Button from "react-native-button"
import firebase from "react-native-firebase"
import ImagePicker from "react-native-image-picker"
import ActionSheet from "react-native-actionsheet"
import { KeyboardAwareView } from "react-native-keyboard-aware-view"
import Icon from "react-native-vector-icons/FontAwesome"
import LinearGradient from "react-native-linear-gradient"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import ImageView from "react-native-image-view"
import AppStyles from "../../AppStyles"
import ProfileItem from "../../Components/ProfileItem/ProfileItem"
import styles from "./styles"

const regexForNames = /^[a-zA-Z]{2,25}$/

const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/

const regexPassword = /^(?=.*\d).{6,20}$/

const HIT_SLOP = { top: 15, left: 15, right: 15, bottom: 15 }

const firstNameField = {
  index: 0,
  placeholder: "First Name",
  title: "firstName",
  value: "",
  secureTextEntry: false,
  IconSource: AppStyles.iconSet.profile,
  isCompulsory: true,
  isFieldCurrentlyErrored: value => {
    const regexResult = regexForNames.test(value)

    if (value.length > 0 && !regexResult) {
      return true
    }
    if (value.length > 0 && regexResult) {
      return false
    }
  }
}

const lastNameField = {
  index: 1,
  placeholder: "Last Name",
  title: "lastName",
  value: "",
  secureTextEntry: false,
  IconSource: AppStyles.iconSet.profile,
  isCompulsory: false,
  isFieldCurrentlyErrored: value => {
    const regexResult = regexForNames.test(value)

    if (value.length > 0 && !regexResult) {
      return true
    }
    if (value.length > 0 && regexResult) {
      return false
    }
  }
}

const bioField = {
  index: 2,
  placeholder: "Bio",
  title: "bio",
  value: "",
  secureTextEntry: false,
  IconSource: AppStyles.iconSet.edit,
  isCompulsory: false,
  isFieldCurrentlyErrored: () => false
}

const emailField = {
  index: 3,
  placeholder: "Email",
  title: "email",
  value: "",
  secureTextEntry: false,
  IconSource: AppStyles.iconSet.mail,
  isCompulsory: true,
  isFieldCurrentlyErrored: value => {
    const regexResult = regexEmail.test(value)
    if (value.length > 0 && !regexResult) {
      return true
    }
    if (value.length > 0 && regexResult) {
      return false
    }
  }
}

const passwordField = {
  index: 4,
  placeholder: "Password",
  title: "password",
  value: "",
  secureTextEntry: true,
  IconSource: AppStyles.iconSet.lock,
  isCompulsory: false,
  isFieldCurrentlyErrored: value => {
    const regexResult = regexPassword.test(value)
    if (value.length > 0 && !regexResult) {
      return true
    }
    if (value.length > 0 && regexResult) {
      return false
    }
  }
}

class MyProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "My Profile",
    headerLeft: (
      <TouchableOpacity
        style={AppStyles.styleSet.menuBtn.container}
        onPress={() => {
          navigation.openDrawer()
        }}
      >
        <Image
          style={AppStyles.styleSet.menuBtn.icon}
          source={AppStyles.iconSet.menu}
        />
      </TouchableOpacity>
    )
  })

  constructor(props) {
    super(props)
    this.state = {
      profileFormObjectArray: [
        firstNameField,
        lastNameField,
        bioField,
        emailField,
        passwordField
      ],
      userData: [],
      isFieldEdited: false,
      isPreviouslyCalled: true,
      isImgErr: false,
      isImageViewerVisible: false,
      tappedImage: [],
      isIntialFieldsUpdate: true
    }
    console.log(this.props.user.id)

    this.changedFields = []
    this.userRef = firebase
      .firestore()
      .collection("users")
      .doc(this.props.user.id)

    this.unsubscribeUser = null
  }

  componentDidMount() {
    this.updateChangedFields()
    this.unsubscribeUser = this.userRef.onSnapshot(this.onUserprofileUpdate)
  }

  componentWillUnmount() {
    this.unsubscribeUser = this.unsubscribeUser()
  }

  onUserprofileUpdate = querySnapshot => {
    const data = querySnapshot.data()

    console.log("user info is ==", data)

    if (data) {
      const tempProfileFormObjectArrayState = Object.assign(
        [],
        this.state.profileFormObjectArray
      )
      tempProfileFormObjectArrayState[0].value = data.firstName
      tempProfileFormObjectArrayState[1].value = data.lastName
      tempProfileFormObjectArrayState[2].value = data.bio
      tempProfileFormObjectArrayState[3].value = data.email
      this.setState(
        {
          userData: data,
          profileFormObjectArray: tempProfileFormObjectArrayState
        },
        () => {
          this.updateChangedFields(data)
        }
      )
    }
    // console.log('data ', data);
    // console.log('onUserprofileUpdate ', this.changedFields);
  }

  updateChangedFields = data => {
    if (this.state.isIntialFieldsUpdate) {
      if (data) {
        this.setState({ isIntialFieldsUpdate: false })
        this.changedFields = []
      }

      this.state.profileFormObjectArray.map((field, ind) => {
        const changedObject = {
          index: field.index,
          title: field.title,
          value: field.value,
          isCurrentlyError: false,
          isCompulsory: field.isCompulsory
        }

        this.changedFields.push(changedObject)
      })
    }
  }

  onChangeField = fieldObject => {
    this.setState({ isFieldEdited: true })
    const shouldUpdateObjInChangedFieldsArray = this.hasFieldAlreadyBeenUpdated(
      fieldObject.index,
      this.changedFields
    )

    if (!fieldObject.isCurrentlyError && fieldObject.value) {
      this.handleFieldUpdate(shouldUpdateObjInChangedFieldsArray, fieldObject)
    }
    if (
      fieldObject.isCurrentlyError &&
      shouldUpdateObjInChangedFieldsArray.isFound
    ) {
      this.changedFields.splice(shouldUpdateObjInChangedFieldsArray.atIndex, 1)
    }
    if (
      shouldUpdateObjInChangedFieldsArray.isFound &&
      !fieldObject.value &&
      fieldObject.isCompulsory
    ) {
      this.changedFields.splice(shouldUpdateObjInChangedFieldsArray.atIndex, 1)
    }
    if (
      !shouldUpdateObjInChangedFieldsArray.isFound &&
      fieldObject.isCompulsory == false &&
      !fieldObject.value
    ) {
      this.handleFieldUpdate(shouldUpdateObjInChangedFieldsArray, fieldObject)
    }
    console.log(this.changedFields)
  }

  handleFieldUpdate = (isFieldObjInArray, fieldObject) => {
    if (isFieldObjInArray.isFound) {
      this.changedFields[isFieldObjInArray.atIndex] = fieldObject
    } else {
      this.changedFields.push(fieldObject)
    }
  }

  hasFieldAlreadyBeenUpdated = (index, array) => {
    let result = {
      isFound: false,
      atIndex: -1
    }

    for (let i = 0; i < array.length; i++) {
      const changedFieldObject = array[i]
      // check if the index of the field that was just changed exists in the array that holds a historical records of all changed fields

      if (index == changedFieldObject.index) {
        result = {
          isFound: true,
          atIndex: i
        }
        break
      }
    }

    return result
  }

  onUpdateButtonPressed = () => {
    const self = this
    const objectToUpdate = {}
    const emptyFields = this.getEmptyFields(
      this.changedFields,
      this.state.profileFormObjectArray
    )
    self.changedFields.map(field => {
      objectToUpdate[field.title] = field.value
    })

    const { firstName, lastName, email, bio } = objectToUpdate
    console.log("objectToUpdate", objectToUpdate)

    if (!self.state.isFieldEdited) {
      Alert.alert("", "No changes has been made!", [{ text: "OK" }], {
        cancelable: false
      })
    } else if (
      self.changedFields.length === self.state.profileFormObjectArray.length
    ) {
      self.userRef
        .update({
          firstName,
          lastName,
          email,
          bio
        })
        .then(function() {
          Alert.alert(
            "Success...",
            "Your profile was successfully updated!",
            [{ text: "OK" }],
            {
              cancelable: false
            }
          )
          // get user data to be updated in redux
          self.userRef.get().then(user => {
            const loggedInUserData = { isloggedIn: true, user: user.data() }
            self.props.navigation.dispatch({
              type: "Login",
              user: user.data()
            })
            AsyncStorage.setItem(
              "@isUserloggedIn:value",
              JSON.stringify(loggedInUserData)
            )
          })
        })
        .catch(function(error) {
          alert(error)
        })
    } else {
      Alert.alert(
        "Please try again...",
        `${self.createErrorStringPrint(
          emptyFields
        )} field(s) must not be empty or invalid!`
      )
    }
  }

  createErrorStringPrint = emptyFieldsArray => {
    let emptyFieldsString = ""

    for (let i = 0; i < emptyFieldsArray.length; i++) {
      const currentEmptyField = emptyFieldsArray[i]
      if (i === emptyFieldsArray.length - 1) {
        emptyFieldsString += `${currentEmptyField.placeholder}`
      } else {
        emptyFieldsString += `${currentEmptyField.placeholder}, `
      }
    }

    return emptyFieldsString
  }

  getEmptyFields = (updatedProfileFieldArray, allProfileFields) => {
    const emptyFieldArray = []

    for (let i = 0; i < allProfileFields.length; i++) {
      let hasFieldBeenUpdated = false
      const currentField = allProfileFields[i]

      for (let i = 0; i < updatedProfileFieldArray.length; i++) {
        const answeredQuestion = updatedProfileFieldArray[i]
        if (currentField.index === answeredQuestion.index) {
          hasFieldBeenUpdated = true
          break
        }
      }
      if (!hasFieldBeenUpdated) {
        emptyFieldArray.push(currentField)
      }
    }
    return emptyFieldArray
  }

  onPressRemovePhotoBtn = uri => {
    console.log("in onPressRemovePhotoBtn")
    this.userRef
      .update({
        profilePictureURL: uri
      })
      .then(function() {
        Alert.alert("", "Profile Successfully Updated!", [{ text: "OK" }], {
          cancelable: false
        })
      })
      .catch(function(error) {
        alert(error)
      })
  }

  onUploadImage = uri => {
    const self = this
    console.log("uri ==", uri)
    const filename = uri.substring(uri.lastIndexOf("/") + 1)
    console.log("filename ==", filename)

    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri
    firebase
      .storage()
      .ref(filename)
      .putFile(uploadUri)
      .then(function(snapshot) {
        self.setState({ photoUrl: snapshot.downloadURL })
        // photoUrls.push(snapshot.downloadURL);
      })
      .then(() => {
        console.log("before onPressRemovePhotoBtn")
        this.onPressRemovePhotoBtn(this.state.photoUrl)
      })
      .catch(function(error) {
        alert(error)
      })

    // this.setState({
    //   localPhotos: [...this.state.localPhotos, response.uri],
    // });
  }

  onPressAddPhotoBtn = () => {
    // More info on all the options is below in the API Reference... just some common use cases shown here
    const options = {
      title: "Select a photo",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    }

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker")
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error)
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton)
      } else {
        this.onUploadImage(response.uri)
      }
    })
  }

  renderFormObject = () => {
    return this.state.profileFormObjectArray.map((data, ind) => {
      return (
        <ProfileItem
          index={ind}
          title={data.title}
          secureTextEntry={data.secureTextEntry}
          placeholder={data.placeholder}
          IconSource={data.IconSource}
          isCompulsory={data.isCompulsory}
          onChangeField={this.onChangeField}
          isFieldCurrentlyErrored={data.isFieldCurrentlyErrored}
          key={ind}
          value={data.value}
        />
      )
    })
  }

  onActionDone = index => {
    if (index == 0) {
      console.log("add index", index)
      this.onPressAddPhotoBtn()
    }
    if (index == 2) {
      console.log("remove index", index)
      this.onPressRemovePhotoBtn(
        "https://www.instamobile.io/wp-content/uploads/2019/05/default-avatar.jpg"
      )
    }
  }

  showActionSheet = index => {
    this.setState({
      selectedPhotoIndex: index
    })
    this.ActionSheet.show()
  }

  onImageError = () => {
    Alert.alert(
      "",
      "An error occurred while trying to load Profile Picture!",
      [{ text: "OK" }],
      {
        cancelable: false
      }
    )
    const tempUserData = Object.assign({}, this.state.userData)
    tempUserData.profilePictureURL = ""
    this.setState({ userData: tempUserData })
  }

  displayProfilePhoto = url => {
    const isAvartar = url.search("avatar")
    const image = [
      {
        source: {
          uri: url
        }
        // width: 806,
        // height: 720,
      }
    ]
    if (isAvartar === -1) {
      this.setState({
        tappedImage: image,
        isImageViewerVisible: true
      })
    }
  }

  closeButton = () => (
    <TouchableOpacity
      hitSlop={HIT_SLOP}
      style={styles.closeButton}
      onPress={() => this.setState({ isImageViewerVisible: false })}
    >
      <Text style={styles.closeButton__text}>×</Text>
    </TouchableOpacity>
  )

  render() {
    return (
      <KeyboardAwareScrollView bounces={false}>
        <View style={styles.container}>
          <View style={styles.imageBlock}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() =>
                this.displayProfilePhoto(this.state.userData.profilePictureURL)
              }
            >
              <Image
                style={[
                  styles.image,
                  { opacity: this.state.userData.profilePictureURL ? 1 : 0.3 }
                ]}
                source={
                  this.state.userData.profilePictureURL
                    ? { uri: this.state.userData.profilePictureURL }
                    : AppStyles.iconSet.userAvatar
                }
                resizeMode="cover"
                onError={this.onImageError}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.showActionSheet}
              style={[styles.addButton, styles.photo]}
            >
              <Icon name="camera" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <ScrollView
              style={{ width: "89%" }}
              showsVerticalScrollIndicator={false}
            >
              {this.renderFormObject()}
              <ActionSheet
                ref={o => (this.ActionSheet = o)}
                title="Confirm action?"
                options={["Add New Profile Photo", "Cancel", "Remove"]}
                cancelButtonIndex={1}
                destructiveButtonIndex={2}
                onPress={index => {
                  this.onActionDone(index)
                }}
              />
              <ImageView
                images={this.state.tappedImage}
                isVisible={this.state.isImageViewerVisible}
                onClose={() => this.setState({ isImageViewerVisible: false })}
                controls={{ close: this.closeButton }}
              />
            </ScrollView>
            <LinearGradient
              colors={[
                "#00FFFF",
                "#17C8FF",
                "#329BFF",
                "#4C64FF",
                "#6536FF",
                "#8000FF"
              ]}
              start={{ x: 0.0, y: 1.0 }}
              end={{ x: 1.0, y: 1.0 }}
              style={styles.linearGradientContainer}
            >
              <Button
                containerStyle={[styles.buttonContainer]}
                style={styles.buttonText}
                onPress={this.onUpdateButtonPressed}
              >
                Update Profile
              </Button>
            </LinearGradient>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
})

export default MyProfileScreen

// export default MyProfileScreen;
// AppStyles.iconSet.share

{
  /* <Image
  style={{height: 30, width: 30}}
  source={AppStyles.iconSet.addCamera}
  resizeMode="contain"
/> */
}
