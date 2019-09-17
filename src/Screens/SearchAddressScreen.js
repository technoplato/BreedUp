import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

export default ({ navigation, value = '' }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      listViewDisplayed="auto" // true/false/undefined
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        const { lat, lng } = details.geometry.location
        const uri = {
          ios: 'maps:' + lat + ',' + lng + '?q=' + data.description,
          android: 'geo:' + lat + ',' + lng + '?q=' + data.description
        }

        navigation.state.params.onLocationChosen({
          name: data.description,
          coords: { lat, lng },
          address: details.formatted_address,
          uri
        })

        navigation.goBack()
      }}
      getDefaultValue={() => value}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyCmeUy6r4hgxkk5x4_it6Ndaj6mawQ3D5c',
        language: 'en' // language of the results
      }}
      styles={{
        textInputContainer: {
          width: '100%'
        },
        description: {
          fontWeight: 'bold'
        }
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance'
      }}
      GooglePlacesDetailsQuery={{
        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
        fields: 'formatted_address'
      }}
      filterReverseGeocodingByTypes={[
        'locality',
        'administrative_area_level_3'
      ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
    />
  )
}
