import React from 'react'

import CreatePostScreen from '../../Containers/CreatePost'
import CameraModal from '../../../lib/InstagramCameraModal'

export default class AddPostScreen extends React.Component {
  state = { modalVisible: true }
  constructor(props) {
    super(props)

    this.cancelPhoto = this.cancelPhoto.bind(this)
    this.revealPhotoModal = this.revealPhotoModal.bind(this)
    this.renderNonsense = this.renderNonsense.bind(this)
  }

  renderNonsense(selectedImageUri) {
    return <CreatePostScreen finish={this.cancelPhoto} uri={selectedImageUri} />
  }

  revealPhotoModal() {
    this.setState({ modalVisible: true })
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', this.revealPhotoModal)
  }

  cancelPhoto() {
    this.setState({ modalVisible: false })
    this.props.navigation.goBack()
  }

  render() {
    return (
      <CameraModal
        onPictureApproved={uri => console.log(uri)}
        isVisible={this.state.modalVisible}
        cancel={this.cancelPhoto}
        screenAfterImageSelection={this.renderNonsense}
      />
    )
  }
}
