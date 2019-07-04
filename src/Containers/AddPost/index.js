import React from "react"

import SubmitPostScreen from "../../Containers/SubmitPostScreen"
import CameraModal from "../../../lib/InstagramCameraModal"

export default class AddPostScreen extends React.Component {
  state = { modalVisible: true }
  constructor(props) {
    super(props)

    this.cancelPhoto = this.cancelPhoto.bind(this)
    this.revealPhotoModal = this.revealPhotoModal.bind(this)
    this.renderSubmitPost = this.renderSubmitPost.bind(this)
  }

  renderSubmitPost(selectedImageUri) {
    return <SubmitPostScreen finish={this.cancelPhoto} uri={selectedImageUri} />
  }

  revealPhotoModal() {
    this.setState({ modalVisible: true })
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", this.revealPhotoModal)
  }

  cancelPhoto() {
    this.setState({ modalVisible: false })
    this.props.navigation.goBack()
  }

  render() {
    return (
      <CameraModal
        onPictureApproved={uri => {}}
        isVisible={this.state.modalVisible}
        cancel={this.cancelPhoto}
        screenAfterImageSelection={this.renderSubmitPost}
      />
    )
  }
}
