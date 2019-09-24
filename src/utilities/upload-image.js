import storage from '@react-native-firebase/storage'
import ImageResizer from 'react-native-image-resizer'

const IMAGE_SIZE = 1500
const QUALITY = 100

/**
 * Uploads an image to Firebase and returns the URL.
 */
export default async (imageUri, path = '') => {
  const resizedUri = await ImageResizer.createResizedImage(
    imageUri,
    IMAGE_SIZE,
    IMAGE_SIZE,
    'PNG',
    QUALITY
  ).then(response => response.uri)

  const storageRef = storage()
    .ref()
    .child(path)

  await storageRef.putFile(resizedUri)
  return storageRef.getDownloadURL()
}
