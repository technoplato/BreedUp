import React from 'react'
import { View, Text, Image } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import Modal from 'react-native-modal'

import Camera from '../../src/Components/Camera'

export default class CameraModal extends React.Component {
  ModalState = {
    /**
     * This is the state of the modal before an image has been either taken
     * or selected from the user's library.
     */
    BEFORE_IMAGE: 1,
    /**
     * This is the state of the modal after an image has been either taken
     * or selected from the user's library.
     */
    AFTER_IMAGE: 2,
    /**
     * This is the state of the modal after an image has been approved by
     * the user.
     *
     * If no `props.screenAfterImageSelection` has been provided, the callback
     * onPictureApproved will be invoked by the modal.
     * If there is a `props.screenAfterImageSelection`, that UI will be shown
     * and the control is then in the creator of that UI.
     */
    AFTER_APPROVAL: 3
  }

  state = { modalState: this.ModalState.BEFORE_IMAGE }

  constructor(props) {
    super(props)

    this.takePicture = this.takePicture.bind(this)
    this.pickImageFromLibrary = this.pickImageFromLibrary.bind(this)
    this.approvePicture = this.approvePicture.bind(this)
    this.showTakePicture = this.showTakePicture.bind(this)
    this.showApprovePicture = this.showApprovePicture.bind(this)
    this.resetState = this.resetState.bind(this)
  }

  resetState() {
    return new Promise((resolve, reject) => {
      this.setState(
        {
          modalState: this.ModalState.BEFORE_IMAGE,
          uri: ''
        },
        state => {
          resolve(state)
        }
      )
    })
  }

  centerButtonForModalState(state) {
    switch (state) {
      case this.ModalState.BEFORE_IMAGE:
        return { text: 'Take Picture', onPress: this.takePicture }
      case this.ModalState.AFTER_IMAGE:
        return { text: 'Approve Picture', onPress: this.approvePicture }
      default:
        throw new Exception('Illegal state for modal')
    }
  }

  renderCenterButton() {
    const details = this.centerButtonForModalState(this.state.modalState)
    return (
      <Text style={{ padding: 24 }} onPress={details.onPress}>
        {details.text}
      </Text>
    )
  }

  bottomLeftButtonForModalState(state) {
    switch (state) {
      case this.ModalState.BEFORE_IMAGE:
        return { text: 'Library', onPress: this.pickImageFromLibrary }
      case this.ModalState.AFTER_IMAGE:
        return { text: 'Retake', onPress: this.showTakePicture }
      default:
        throw new Exception('Illegal state for modal')
    }
  }

  renderBottomLeftButton() {
    const details = this.bottomLeftButtonForModalState(this.state.modalState)
    return (
      <Text style={{ padding: 24 }} onPress={details.onPress}>
        {details.text}
      </Text>
    )
  }

  renderCancelButton() {
    return (
      <Text style={{ padding: 24 }} onPress={this.props.cancel}>
        Cancel
      </Text>
    )
  }

  render() {
    const { screenAfterImageSelection } = this.props
    const showScreenAfterImageSelection =
      this.state.modalState == this.ModalState.AFTER_APPROVAL &&
      screenAfterImageSelection
    return (
      <Modal
        onModalHide={this.resetState}
        style={{ margin: 0 }}
        isVisible={this.props.isModalVisible}
      >
        {showScreenAfterImageSelection
          ? screenAfterImageSelection(this.state.uri)
          : this.renderCameraModalContent()}
      </Modal>
    )
  }

  renderCameraModalContent() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {this.renderCameraOrImage()}
        <View
          style={{
            flex: 0.45,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {this.renderCenterButton()}
          <View
            style={{
              padding: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              position: 'absolute',
              bottom: 0,
              width: '100%'
            }}
          >
            {this.renderBottomLeftButton()}
            {this.renderCancelButton()}
          </View>
        </View>
      </View>
    )
  }

  /**
   * Since the Image preview is shown in the same UI element as the Camera, we
   * just need to decide whether we're showing one or the other. In this
   * method, we make that decision and render the proper layout.
   */
  renderCameraOrImage() {
    switch (this.state.modalState) {
      case this.ModalState.BEFORE_IMAGE:
        return (
          <View
            style={{
              flex: 0.55,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Camera
              ref={ref => {
                this.camera = ref
              }}
              onNewPhotoUri={this.showApprovePicture}
            />
          </View>
        )
      case this.ModalState.AFTER_IMAGE:
        return (
          <Image
            source={{ uri: this.state.uri }}
            style={{
              flex: 0.55,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
        )
    }
  }

  /**
   * Calls through to child `Camera` component to take the picture.
   *
   * Once a picture has been taken, the child Camera will dispatch a callback
   * to a method passed via props called onNewPhotoUri.
   */
  takePicture() {
    this.camera.takePicture()
  }

  /**
   * Instructs the modal to show the UI for taking a picture.
   * The UI for taking a picture contains the live camera view with
   * appropriate buttons.
   */
  showTakePicture() {
    this.setState({
      modalState: this.ModalState.BEFORE_IMAGE,
      uri: ''
    })
  }

  /**
   * Instructs the modal to show the UI for approving a picture
   * once taken. It will show the still image as well as appropriate buttons
   * for approving, retaking, or cancelling the process altogether.
   */
  showApprovePicture(uri) {
    this.setState({
      modalState: this.ModalState.AFTER_IMAGE,
      uri: uri
    })
  }

  /**
   * Invoked when the user indicates that they are satisfied with the selected
   * picture.
   *
   * If the consumer of this API has indicated a desired UI to show in the
   * Modal after the user approves the image (through `props.screenAfterImageSelection`),
   * it is shown at this point.
   * Otherwise, the callback `props.onPictureApproved` is invoked with the URI
   * of the approved image.
   */
  approvePicture() {
    // UI to be shown after user approves image
    // If it exists, it will be shown
    const { screenAfterImageSelection } = this.props
    const { uri } = this.state

    if (screenAfterImageSelection) {
      this.renderScreenAfterImage(screenAfterImageSelection(uri))
    } else {
      this.props.onPictureApproved(this.state.uri)
      this.resetState().then(() => {
        this.props.cancel()
      })
    }
  }

  renderScreenAfterImage(screen) {
    this.setState({
      modalState: this.ModalState.AFTER_APPROVAL
    })
  }

  pickImageFromLibrary() {
    ImagePicker.launchImageLibrary(null, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        this.showApprovePicture(response.uri)
      }
    })
  }
}
