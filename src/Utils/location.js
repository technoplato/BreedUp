const KEY = "AIzaSyBiBUbWUtBJrCincC5hyQ6JKnSBsPs3t9w"

export const getCoordinatesForAddress = async address => {
  console.log("address", address)
  return await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=
    ${encodeURIComponent(address)}
      &key=${KEY}`
  )
    .then(res => res.json())
    .then(json => {
      console.log(JSON.stringify(json))
      return json
    })
    .then(data => Object.values(data.results[0].geometry.location))
    .catch(() => null)
}
