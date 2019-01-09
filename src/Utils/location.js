const KEY = 'AIzaSyBiBUbWUtBJrCincC5hyQ6JKnSBsPs3t9w'

export const getCoordinatesForAddress = async address => {
  return await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${KEY}`
  )
    .then(res => res.json())
    .then(data => data.results[0].geometry.location)
}
